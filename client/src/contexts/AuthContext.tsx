import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData?: { firstName?: string; lastName?: string }) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // If user signs in, create or update user record in our database
      if (event === 'SIGNED_IN' && session?.user) {
        await createOrUpdateUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const createOrUpdateUser = async (user: User) => {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!existingUser) {
        // Create new user
        const { error } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            first_name: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || '',
            last_name: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
            role: user.email === 'admin@gadgethub.com' ? 'admin' : 'user',
            is_active: true,
          })

        if (error) {
          console.error('Error creating user:', error)
        }
      } else {
        // Update existing user
        const { error } = await supabase
          .from('users')
          .update({
            email: user.email!,
            first_name: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || existingUser.first_name,
            last_name: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || existingUser.last_name,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)

        if (error) {
          console.error('Error updating user:', error)
        }
      }
    } catch (error) {
      console.error('Error in createOrUpdateUser:', error)
    }
  }

  const signUp = async (email: string, password: string, userData?: { firstName?: string; lastName?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData?.firstName || '',
          last_name: userData?.lastName || '',
        },
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with:', email)
    
    try {
      // First, sign out any existing session to avoid conflicts
      console.log('Signing out any existing session...')
      await supabase.auth.signOut()
      
      // Wait a moment for the sign out to complete
      await new Promise(resolve => setTimeout(resolve, 100))
      
      console.log('Calling signInWithPassword...')
      
      // Add timeout to prevent hanging
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Authentication timeout')), 10000)
      )
      
      const { data, error } = await Promise.race([signInPromise, timeoutPromise]) as any
      console.log('Sign in response:', { data, error })
      
      if (error) {
        console.error('Sign in error:', error)
        return { data: null, error }
      }
      
      if (data?.user) {
        console.log('User signed in successfully:', data.user.email)
        // Create or update user in our database
        await createOrUpdateUser(data.user)
      }
      
      return { data, error }
    } catch (err) {
      console.error('Sign in exception:', err)
      return { data: null, error: { message: 'Network error or authentication failed' } }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // Check if user is admin
  const isAdmin = user?.email === 'admin@gadgethub.com'

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
