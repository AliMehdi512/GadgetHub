import { Link } from "wouter";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  cartItemCount?: number;
  onCartClick: () => void;
}

export function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center" data-testid="link-home">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-tight">
              DISTRICT
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/shop" className="text-sm uppercase tracking-wide font-bold hover-elevate px-3 py-2 rounded-md" data-testid="link-shop">
              Shop
            </Link>
            <Link href="/categories" className="text-sm uppercase tracking-wide font-bold hover-elevate px-3 py-2 rounded-md" data-testid="link-categories">
              Categories
            </Link>
            <Link href="/new" className="text-sm uppercase tracking-wide font-bold hover-elevate px-3 py-2 rounded-md" data-testid="link-new">
              New
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              data-testid="button-search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartClick}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* User */}
            {isAuthenticated ? (
              <Link href="/dashboard" data-testid="link-dashboard">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <a href="/api/login" data-testid="link-login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </a>
            )}
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
    </header>
  );
}
