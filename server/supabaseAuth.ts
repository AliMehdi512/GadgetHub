import { createClient } from '@supabase/supabase-js'
import type { Request, Response, NextFunction } from 'express'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export async function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authorization token provided' })
    }

    const token = authHeader.substring(7)
    
    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    // Get user role from our database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError) {
      return res.status(500).json({ message: 'Error fetching user data' })
    }

    req.user = {
      id: user.id,
      email: user.email!,
      role: userData?.role || 'user'
    }

    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(500).json({ message: 'Authentication failed' })
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }

  next()
}
