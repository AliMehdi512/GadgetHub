import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, CartItem } from "@shared/schema";

export default function Shop() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Fetch cart items
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

  // Loading state
  if (productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={cartItems.length} onCartClick={() => setCartOpen(true)} />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Mock data for empty state
  const mockProducts: Product[] = [
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
    {
      id: "5",
      name: "3D Asset Library",
      slug: "3d-asset-library",
      description: "High-quality 3D models",
      price: "79.99",
      imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      images: [],
      stockCount: 8,
      isDigital: true,
      isLimitedEdition: false,
      isFeatured: false,
      averageRating: "4.6",
      reviewCount: 67,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: null,
      downloadUrl: null,
      licenseKey: null,
    },
    {
      id: "6",
      name: "Mockup Collection",
      slug: "mockup-collection",
      description: "Professional mockups",
      price: "34.99",
      imageUrl: "https://images.unsplash.com/photo-1600096194735-ec70961c937f?w=800&q=80",
      images: [],
      stockCount: 12,
      isDigital: true,
      isLimitedEdition: false,
      isFeatured: false,
      averageRating: "4.8",
      reviewCount: 92,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: null,
      downloadUrl: null,
      licenseKey: null,
    },
  ];

  // Use real products if available, otherwise use mock data
  const displayProducts = products.length > 0 ? products : mockProducts;

  // Transform cart items for drawer
  const cartDrawerItems = cartItems.map(item => ({
    id: item.id,
    product: {
      id: item.productId,
      name: "Product", // Will be populated from product data
      price: "0",
      imageUrl: "",
      slug: "",
    },
    quantity: item.quantity,
  }));

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

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl font-heading font-bold uppercase mb-4">
              All Products
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover our complete collection of premium digital products
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h3 className="text-lg font-heading font-bold uppercase">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    data-testid="button-toggle-filters"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className={`space-y-6 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                  {/* Price Range */}
                  <div>
                    <h4 className="text-sm uppercase tracking-widest font-bold mb-3">Price Range</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox id="price-0-25" data-testid="checkbox-price-0-25" />
                        <Label htmlFor="price-0-25" className="ml-2 text-sm cursor-pointer">
                          Under $25
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="price-25-50" data-testid="checkbox-price-25-50" />
                        <Label htmlFor="price-25-50" className="ml-2 text-sm cursor-pointer">
                          $25 - $50
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="price-50-100" data-testid="checkbox-price-50-100" />
                        <Label htmlFor="price-50-100" className="ml-2 text-sm cursor-pointer">
                          $50 - $100
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="price-100-plus" data-testid="checkbox-price-100-plus" />
                        <Label htmlFor="price-100-plus" className="ml-2 text-sm cursor-pointer">
                          $100+
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h4 className="text-sm uppercase tracking-widest font-bold mb-3">Availability</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox id="in-stock" defaultChecked data-testid="checkbox-in-stock" />
                        <Label htmlFor="in-stock" className="ml-2 text-sm cursor-pointer">
                          In Stock
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="limited-edition" data-testid="checkbox-limited-edition" />
                        <Label htmlFor="limited-edition" className="ml-2 text-sm cursor-pointer">
                          Limited Edition
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="text-sm uppercase tracking-widest font-bold mb-3">Rating</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox id="rating-4" data-testid="checkbox-rating-4" />
                        <Label htmlFor="rating-4" className="ml-2 text-sm cursor-pointer">
                          4+ Stars
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="rating-5" data-testid="checkbox-rating-5" />
                        <Label htmlFor="rating-5" className="ml-2 text-sm cursor-pointer">
                          5 Stars
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort and Count */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-muted-foreground" data-testid="text-product-count">
                  Showing {displayProducts.length} products
                </p>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48" data-testid="select-sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Products */}
              {displayProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-2xl font-heading font-bold uppercase mb-4">No Products Yet</p>
                  <p className="text-muted-foreground">Check back soon for new arrivals</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {displayProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Load More */}
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" className="uppercase font-bold tracking-wide" data-testid="button-load-more">
                  Load More Products
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
