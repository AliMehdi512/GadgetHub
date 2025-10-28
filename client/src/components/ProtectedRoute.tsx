import { useLocation } from 'wouter'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'wouter'
import { Lock, ArrowLeft } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const [, setLocation] = useLocation()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page",
        variant: "destructive",
      })
    } else if (!loading && adminOnly && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Admin access required for this page",
        variant: "destructive",
      })
    }
  }, [isAuthenticated, isAdmin, loading, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Lock className="h-12 w-12 text-primary" />
                </motion.div>
              </div>
              <CardTitle className="text-2xl font-bold">Authentication Required</CardTitle>
              <CardDescription>
                Please sign in to access this page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Link href="/login">
                  <Button className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
              <div className="text-center">
                <Link href="/">
                  <motion.a
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ x: -2 }}
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to home
                  </motion.a>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Lock className="h-12 w-12 text-destructive" />
                </motion.div>
              </div>
              <CardTitle className="text-2xl font-bold text-destructive">Access Denied</CardTitle>
              <CardDescription>
                Admin access required for this page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Link href="/">
                  <Button className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
