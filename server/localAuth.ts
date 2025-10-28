import type { Express, RequestHandler } from "express";
import session from "express-session";
import { storage } from "./storage";

// Simple local authentication without external dependencies
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  return session({
    secret: process.env.SESSION_SECRET || "local-dev-secret-fallback",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for local development
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.use(getSession());

  // Simple login endpoint for local development
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, name } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if user exists, if not create one
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.upsertUser({
          email,
          firstName: name || "Local User",
          lastName: "",
          profileImageUrl: null,
          role: email === 'admin@gadgethub.com' ? 'admin' : 'user',
        });
      }

      // Set user in session
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        name: user.firstName,
        role: user.role,
      };

      res.json({ success: true, user: { id: user.id, email, name: user.firstName, role: user.role } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Get current user endpoint
  app.get("/api/auth/user", async (req, res) => {
    try {
      const sessionUser = (req.session as any).user;
      if (!sessionUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(sessionUser.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const sessionUser = (req.session as any).user;
  
  if (!sessionUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Add user info to request for compatibility
  (req as any).user = {
    claims: {
      sub: sessionUser.id,
    },
  };

  next();
};

// Helper to check if user is authenticated (returns boolean)
export const checkAuthenticated = (req: any): boolean => {
  return !!(req.session as any).user;
};

// Admin middleware
export const isAdmin: RequestHandler = async (req, res, next) => {
  const sessionUser = (req.session as any).user;
  
  if (!sessionUser) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  if (sessionUser.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
};
