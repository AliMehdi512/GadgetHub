import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertProductSchema,
  insertCategorySchema,
  insertCartItemSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertReviewSchema,
} from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      // Increment view count
      await storage.incrementProductView(req.params.id);
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  app.get("/api/products/slug/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      // Increment view count
      await storage.incrementProductView(product.id);
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  app.post("/api/products", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating product: " + error.message });
    }
  });

  app.put("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: "Error updating product: " + error.message });
    }
  });

  app.delete("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: "Error deleting product: " + error.message });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching categories: " + error.message });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching category: " + error.message });
    }
  });

  app.get("/api/categories/slug/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching category: " + error.message });
    }
  });

  app.post("/api/categories", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating category: " + error.message });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req: any, res) => {
    try {
      const userId = req.isAuthenticated() ? req.user.claims.sub : null;
      const sessionId = req.sessionID;
      const items = await storage.getCartItems(userId, sessionId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching cart: " + error.message });
    }
  });

  app.post("/api/cart", async (req: any, res) => {
    try {
      const userId = req.isAuthenticated() ? req.user.claims.sub : null;
      const sessionId = req.sessionID;
      
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        userId,
        sessionId: userId ? null : sessionId,
      });

      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: "Error adding to cart: " + error.message });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      res.json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: "Error updating cart item: " + error.message });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      await storage.removeFromCart(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: "Error removing from cart: " + error.message });
    }
  });

  app.delete("/api/cart", async (req: any, res) => {
    try {
      const userId = req.isAuthenticated() ? req.user.claims.sub : null;
      const sessionId = req.sessionID;
      await storage.clearCart(userId, sessionId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: "Error clearing cart: " + error.message });
    }
  });

  // Order routes
  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching orders: " + error.message });
    }
  });

  app.get("/api/orders/:id", isAuthenticated, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching order: " + error.message });
    }
  });

  app.get("/api/orders/:id/items", isAuthenticated, async (req, res) => {
    try {
      const items = await storage.getOrderItems(req.params.id);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching order items: " + error.message });
    }
  });

  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { items, totalAmount, stripePaymentIntentId } = req.body;

      // Create order
      const validatedOrder = insertOrderSchema.parse({
        userId,
        totalAmount,
        stripePaymentIntentId,
        status: "completed", // For digital products, instant delivery
      });

      const order = await storage.createOrder(validatedOrder);

      // Create order items with digital delivery info
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (!product) continue;

        const orderItemData = insertOrderItemSchema.parse({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity || 1,
          price: product.price,
          downloadUrl: product.downloadUrl || `/downloads/${product.slug}.zip`,
          licenseKey: product.licenseKey || `LICENSE-${randomUUID().substring(0, 8).toUpperCase()}`,
        });

        await storage.createOrderItem(orderItemData);
      }

      // Clear cart after successful order
      await storage.clearCart(userId, null);

      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating order: " + error.message });
    }
  });

  // Review routes
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(req.params.id);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching reviews: " + error.message });
    }
  });

  app.post("/api/reviews", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        userId,
      });

      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating review: " + error.message });
    }
  });

  // Stripe payment intent route (placeholder - will work once Stripe keys are added)
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;

      // Check if Stripe is configured
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(503).json({
          message: "Payment processing not configured. Please add Stripe keys.",
          clientSecret: "STRIPE_NOT_CONFIGURED",
        });
      }

      // When Stripe keys are added, this will create a real payment intent
      // For now, return a mock response
      res.json({
        clientSecret: "pi_mock_secret",
        message: "Add STRIPE_SECRET_KEY to enable real payments",
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
