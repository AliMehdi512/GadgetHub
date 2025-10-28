import { Link } from "wouter";
import { ShoppingCart, Search, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  cartItemCount?: number;
  onCartClick: () => void;
}

export function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAuthenticated, signOut, isAdmin } = useAuth();

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1), 0 0 40px rgba(255, 107, 107, 0.05)"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-accent/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </motion.div>

              {/* Logo */}
              <Link href="/" className="flex items-center" data-testid="link-home">
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Logo Image */}
                  <motion.div
                    className="relative w-10 h-10 sm:w-12 sm:h-12"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <motion.img
                      src="/logo.png"
                      alt="GadgetHub Logo"
                      className="w-full h-full object-contain rounded-lg"
                      style={{
                        filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) brightness(1.1) contrast(1.1)"
                      }}
                      whileHover={{
                        filter: "drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3)) brightness(1.2) contrast(1.2)"
                      }}
                    />
                    
                    {/* Glowing ring around logo */}
                    <motion.div
                      className="absolute inset-0 rounded-lg border-2 border-transparent"
                      animate={{
                        borderColor: [
                          "rgba(255, 107, 107, 0.3)",
                          "rgba(107, 107, 255, 0.3)",
                          "rgba(107, 255, 107, 0.3)",
                          "rgba(255, 107, 107, 0.3)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Brand Name */}
                  <motion.h1
                    className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-tight"
                    whileHover={{ 
                      scale: 1.05,
                      textShadow: "0 0 20px rgba(255, 255, 255, 0.5)"
                    }}
                    style={{
                      background: "linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff80, #00ffff, #0080ff, #8000ff, #ff0080)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      backgroundSize: "400% 400%",
                      animation: "rainbow 3s ease infinite"
                    }}
                  >
                    GadgetHub
                  </motion.h1>
                </motion.div>
              </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {[
              { href: "/shop", label: "Shop", testId: "link-shop" },
              { href: "/categories", label: "Categories", testId: "link-categories" },
              { href: "/new", label: "New", testId: "link-new" }
            ].map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Link href={item.href} data-testid={item.testId}>
                  <motion.div
                    className="relative px-4 py-2 rounded-lg cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Background hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent/10 to-orange-500/10 rounded-lg opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.2 }}
                    />
                    
                    {/* Border glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-lg border border-transparent group-hover:border-accent/30"
                      transition={{ duration: 0.2 }}
                    />
                    
                    {/* Text */}
                    <motion.span
                      className="relative text-sm uppercase tracking-wide font-bold text-foreground group-hover:text-accent transition-colors duration-200"
                      style={{
                        textShadow: "none"
                      }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent/10 transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
                data-testid="button-search"
              >
                <motion.div
                  animate={{ rotate: searchOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Search className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>

            {/* Cart */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-accent/10 transition-colors"
                onClick={onCartClick}
                data-testid="button-cart"
              >
                <motion.div
                  animate={cartItemCount > 0 ? {
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <ShoppingCart className="h-5 w-5" />
                </motion.div>
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs shadow-lg"
                        data-testid="badge-cart-count"
                        style={{
                          background: "linear-gradient(45deg, #ff6b6b, #ff8a80)",
                          boxShadow: "0 0 10px rgba(255, 107, 107, 0.5)"
                        }}
                      >
                        <motion.span
                          key={cartItemCount}
                          initial={{ scale: 1.5 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          {cartItemCount}
                        </motion.span>
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

                {/* User */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isAuthenticated ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:bg-accent/10 transition-colors"
                        >
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <User className="h-5 w-5" />
                          </motion.div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <div className="px-2 py-1.5">
                          <p className="text-sm font-medium">{user?.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {isAdmin ? 'Administrator' : 'Customer'}
                          </p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard">
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem asChild>
                            <Link href="/admin">
                              <User className="mr-2 h-4 w-4" />
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link href="/login">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="hover:bg-accent/10 transition-colors"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button 
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
          </div>
        </div>

        {/* Search Bar (expandable) */}
        {searchOpen && (
          <div className="pb-4">
            <input
              type="search"
              placeholder="Search products..."
              className="w-full px-4 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
              data-testid="input-search"
            />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="px-4 py-4 space-y-2">
            <Link
              href="/shop"
              className="block text-sm uppercase tracking-wide font-bold hover-elevate px-3 py-2 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="link-mobile-shop"
            >
              Shop
            </Link>
            <Link
              href="/categories"
              className="block text-sm uppercase tracking-wide font-bold hover-elevate px-3 py-2 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="link-mobile-categories"
            >
              Categories
            </Link>
            <Link
              href="/new"
              className="block text-sm uppercase tracking-wide font-bold hover-elevate px-3 py-2 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="link-mobile-new"
            >
              New
            </Link>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
