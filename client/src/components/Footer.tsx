import { Link } from "wouter";
import { Instagram, Twitter } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-card border-t border-card-border mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter */}
        <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl font-heading font-bold uppercase mb-4">
            Stay Updated
          </h3>
          <p className="text-muted-foreground mb-6">
            Get early access to new releases and exclusive offers
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
              data-testid="input-newsletter-email"
            />
            <Button className="uppercase font-bold tracking-wide" data-testid="button-subscribe">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-sm uppercase tracking-widest font-bold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-footer-all-products">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/new" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-footer-new-releases">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-footer-categories">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-footer-faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-footer-contact">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-footer-shipping">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest font-bold mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-footer-dashboard">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard/orders" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-footer-orders">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/dashboard/downloads" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-footer-downloads">
                  Downloads
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-footer-terms">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-footer-privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-footer-refund">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-12 pb-12 border-b border-border">
          <div className="text-center">
            <p className="text-2xl font-bold">10,000+</p>
            <p className="text-sm text-muted-foreground">Trusted Customers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">24/7</p>
            <p className="text-sm text-muted-foreground">Customer Support</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">100%</p>
            <p className="text-sm text-muted-foreground">Secure Payments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">Instant</p>
            <p className="text-sm text-muted-foreground">Digital Delivery</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 DISTRICT. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" data-testid="link-instagram">
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" data-testid="link-twitter">
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" data-testid="link-discord">
              <Button variant="ghost" size="icon">
                <SiDiscord className="h-5 w-5" />
              </Button>
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Secured by Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
