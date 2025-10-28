import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import { CursorCraftAnimation } from "@/components/3d/CursorCraftAnimation";
import { WhatsAppButton } from "@/components/WhatsAppButton";

function Router() {
  return (
    <Switch>
      {/* Public routes - accessible to everyone */}
      <Route path="/" component={Landing} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:slug" component={ProductDetail} />
      <Route path="/categories" component={Shop} />
      <Route path="/category/:slug" component={Shop} />
      <Route path="/new" component={Shop} />
      
      {/* Auth routes */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {/* Protected routes - require authentication */}
      <Route path="/checkout" component={Checkout} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/:tab" component={Dashboard} />
      <Route path="/admin" component={Admin} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          
          {/* Global cursor craft animation */}
          <CursorCraftAnimation 
            enabled={true}
            intensity={2}
            craftEmojis={['✨', '🎨', '⚒️', '🛠️', '🎯', '💎', '🌟', '⭐', '🔨', '✂️', '📐', '🎪', '🎭', '🎬', '❄️', '⚡']}
          />
          
          {/* WhatsApp button - sticky across all pages */}
          <WhatsAppButton 
            phoneNumber="923264747914"
            message="Hello! I'm interested in your GadgetHub services."
            position="bottom-right"
            showTooltip={true}
          />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
