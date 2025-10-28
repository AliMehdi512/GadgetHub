import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const { toast } = useToast()
  const [, setLocation] = useLocation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn(email, password)
      console.log('Sign in result:', result)
      
      if (result.error) {
        setError(result.error.message || 'Sign in failed')
        toast({
          title: "Sign in failed",
          description: result.error.message || 'Please check your credentials',
          variant: "destructive",
        })
      } else if (result.data?.user) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        })
        setLocation('/')
      } else {
        setError('Sign in failed - no user data received')
        toast({
          title: "Sign in failed",
          description: 'No user data received',
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error('Sign in error:', err)
      setError(err.message || 'An unexpected error occurred')
      toast({
        title: "Sign in failed",
        description: err.message || 'An unexpected error occurred',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <motion.img
                src="/logo.png"
                alt="GadgetHub Logo"
                className="w-12 h-12 object-contain"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your GadgetHub account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup">
                  <motion.span
                    className="text-primary hover:underline font-medium cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign up
                  </motion.span>
                </Link>
              </div>

              <div className="text-center">
                <Link href="/">
                  <motion.span
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    whileHover={{ x: -2 }}
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to home
                  </motion.span>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
