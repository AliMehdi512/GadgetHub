import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { CategoryBlock } from "@/components/CategoryBlock";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Clock, Zap, Shield } from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, Category, CartItem } from "@shared/schema";
import { motion } from "framer-motion";

export default function Landing() {
  const [cartOpen, setCartOpen] = useState(false);

  // Fetch products and categories
  const { data: allProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });

  // Cart mutations
  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return await apiRequest("PUT", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeCartMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  // Filter featured products
  const featuredProducts = allProducts.filter(p => p.isFeatured).slice(0, 6);

  // Transform cart items for drawer
  const cartDrawerItems = cartItems.map(item => {
    const product = allProducts.find(p => p.id === item.productId);
    return {
      id: item.id,
      product: product || {
        id: item.productId,
        name: "Product",
        price: "0",
        imageUrl: "",
        slug: "",
      },
      quantity: item.quantity,
    };
  });

  // Loading state
  if (productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={cartItems.length} onCartClick={() => setCartOpen(true)} />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Fallback mock data for empty state
  const mockFeaturedProducts = featuredProducts.length === 0 ? [
    {
      id: "1",
      name: "Premium Design Pack",
      slug: "premium-design-pack",
      description: "Complete design system",
      price: "49.99",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      images: [],
      stockCount: 3,
      isDigital: true,
      isLimitedEdition: true,
      isFeatured: true,
      averageRating: "4.8",
      reviewCount: 124,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: null,
      downloadUrl: null,
      licenseKey: null,
    },
    {
      id: "2",
      name: "Icon Set Pro",
      slug: "icon-set-pro",
      description: "500+ premium icons",
      price: "29.99",
      imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      images: [],
      stockCount: 10,
      isDigital: true,
      isLimitedEdition: false,
      isFeatured: true,
      averageRating: "4.9",
      reviewCount: 89,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: null,
      downloadUrl: null,
      licenseKey: null,
    },
    {
      id: "3",
      name: "Typography Bundle",
      slug: "typography-bundle",
      description: "Modern font collection",
      price: "39.99",
      imageUrl: "https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=800&q=80",
      images: [],
      stockCount: 15,
      isDigital: true,
      isLimitedEdition: false,
      isFeatured: true,
      averageRating: "4.7",
      reviewCount: 156,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: null,
      downloadUrl: null,
      licenseKey: null,
    },
    {
      id: "4",
      name: "UI Kit Ultimate",
      slug: "ui-kit-ultimate",
      description: "Complete UI components",
      price: "59.99",
      imageUrl: "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800&q=80",
      images: [],
      stockCount: 2,
      isDigital: true,
      isLimitedEdition: true,
      isFeatured: true,
      averageRating: "5.0",
      reviewCount: 203,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: null,
      downloadUrl: null,
      licenseKey: null,
    },
  ] : [];

  const displayProducts = featuredProducts.length > 0 ? featuredProducts : mockFeaturedProducts;
  const displayCategories = categories.length > 0 ? categories : [
    {
      name: "Design Assets",
      slug: "design-assets",
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
    },
    {
      name: "Code Templates",
      slug: "code-templates",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
    },
    {
      name: "Photography",
      slug: "photography",
      imageUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItems.length} onCartClick={() => setCartOpen(true)} />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartDrawerItems}
        onUpdateQuantity={(id, quantity) => updateCartMutation.mutate({ id, quantity })}
        onRemoveItem={(id) => removeCartMutation.mutate(id)}
      />

      {/* Hero Section */}
          <Hero
            title="GADGET HUB"
            subtitle="Premium tech gadgets and digital products for creators"
            ctaText="Explore Gadgets"
            ctaLink="/shop"
            backgroundImage="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=2000&q=80"
          />

      {/* Flash Sale Banner */}
      <div className="bg-accent text-accent-foreground py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <Clock className="h-5 w-5" />
            <p className="text-sm sm:text-base uppercase font-bold tracking-wide">
              Limited Time: 30% off all premium packs - Ends in 23:59:45
            </p>
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-4xl sm:text-5xl font-heading font-bold uppercase mb-4"
              style={{
                background: "linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff80, #00ffff, #0080ff, #8000ff, #ff0080)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "400% 400%",
                animation: "rainbow 3s ease infinite"
              }}
            >
              Featured Gadgets
            </motion.h2>
            <p className="text-muted-foreground text-lg">
              Hand-picked tech gadgets and digital products for professionals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <a>
                    <Button size="lg" className="uppercase font-bold tracking-wide" data-testid="button-view-all">
                      View All Gadgets
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold uppercase mb-4">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryBlock key={category.slug} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent text-accent-foreground rounded-full mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-bold uppercase mb-2">
                Instant Delivery
              </h3>
              <p className="text-muted-foreground">
                Access your digital products immediately after purchase
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent text-accent-foreground rounded-full mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-bold uppercase mb-2">
                Secure Payments
              </h3>
              <p className="text-muted-foreground">
                Protected by Stripe's industry-leading payment security
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent text-accent-foreground rounded-full mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-bold uppercase mb-2">
                Lifetime Access
              </h3>
              <p className="text-muted-foreground">
                Download your purchases anytime from your account
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl sm:text-6xl font-heading font-bold uppercase mb-6">
            Ready to Explore Gadgets?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 10,000+ tech enthusiasts using our premium gadgets and digital products
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="uppercase font-bold tracking-wide text-lg px-12 py-8"
            onClick={() => {
              // Simple local login - in a real app you'd want a proper login form
              const email = prompt("Enter your email for demo:");
              const name = prompt("Enter your name for demo:");
              if (email) {
                fetch("/api/auth/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, name }),
                }).then(() => window.location.reload());
              }
            }}
            data-testid="button-cta-login"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
