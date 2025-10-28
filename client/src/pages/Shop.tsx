import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, X } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, CartItem, Category } from "@shared/schema";
import { motion } from "framer-motion";

export default function Shop() {
  const [, params] = useRoute("/category/:slug");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    priceRange: [] as string[],
    availability: [] as string[],
    rating: [] as string[],
  });

  // Get category slug from URL
  const categorySlug = params?.slug;

  // Fetch categories to find category ID
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Find current category
  const currentCategory = categories.find(cat => cat.slug === categorySlug);

  // Fetch products with category filter
  const { data: allProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", currentCategory?.id],
    queryFn: async () => {
      const url = currentCategory?.id 
        ? `/api/products?categoryId=${currentCategory.id}`
        : "/api/products";
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
    enabled: true,
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

  // Filter products based on selected filters
  const filteredProducts = allProducts.filter(product => {
    // Price range filter
    if (filters.priceRange.length > 0) {
      const price = Number(product.price);
      const priceMatch = filters.priceRange.some(range => {
        switch (range) {
          case "under-25": return price < 25;
          case "25-50": return price >= 25 && price <= 50;
          case "50-100": return price >= 50 && price <= 100;
          case "100+": return price > 100;
          default: return true;
        }
      });
      if (!priceMatch) return false;
    }

    // Availability filter
    if (filters.availability.length > 0) {
      const availabilityMatch = filters.availability.some(avail => {
        switch (avail) {
          case "in-stock": return product.stockCount > 0;
          case "limited-edition": return product.isLimitedEdition;
          default: return true;
        }
      });
      if (!availabilityMatch) return false;
    }

    // Rating filter
    if (filters.rating.length > 0) {
      const rating = Number(product.averageRating);
      const ratingMatch = filters.rating.some(r => {
        switch (r) {
          case "4+": return rating >= 4;
          case "5": return rating >= 5;
          default: return true;
        }
      });
      if (!ratingMatch) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return Number(a.price) - Number(b.price);
      case "price-high":
        return Number(b.price) - Number(a.price);
      case "rating":
        return Number(b.averageRating) - Number(a.averageRating);
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Handle filter changes
  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      priceRange: [],
      availability: [],
      rating: [],
    });
  };

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

  // Transform cart items for drawer
  const cartDrawerItems = cartItems.map(item => ({
    id: item.id,
    product: {
      id: item.productId,
      name: item.product?.name || "Product",
      price: item.product?.price || "0",
      imageUrl: item.product?.imageUrl || "",
      slug: item.product?.slug || "",
    },
    quantity: item.quantity,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItems.length} onCartClick={() => setCartOpen(true)} />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold uppercase mb-4">
              {currentCategory ? currentCategory.name : "All Products"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {currentCategory ? currentCategory.description : "Discover our complete collection of tech gadgets and digital products"}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold uppercase">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3 uppercase text-sm">Price Range</h3>
                  <div className="space-y-2">
                    {[
                      { value: "under-25", label: "Under $25" },
                      { value: "25-50", label: "$25 - $50" },
                      { value: "50-100", label: "$50 - $100" },
                      { value: "100+", label: "$100+" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={filters.priceRange.includes(option.value)}
                          onCheckedChange={() => handleFilterChange("priceRange", option.value)}
                        />
                        <Label htmlFor={option.value} className="text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3 uppercase text-sm">Availability</h3>
                  <div className="space-y-2">
                    {[
                      { value: "in-stock", label: "In Stock" },
                      { value: "limited-edition", label: "Limited Edition" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={filters.availability.includes(option.value)}
                          onCheckedChange={() => handleFilterChange("availability", option.value)}
                        />
                        <Label htmlFor={option.value} className="text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3 uppercase text-sm">Rating</h3>
                  <div className="space-y-2">
                    {[
                      { value: "4+", label: "4+ Stars" },
                      { value: "5", label: "5 Stars" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={filters.rating.includes(option.value)}
                          onCheckedChange={() => handleFilterChange("rating", option.value)}
                        />
                        <Label htmlFor={option.value} className="text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort and Mobile Filter */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>

              {/* Products Grid */}
              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or browse all products
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-background shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold uppercase">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Same filter content as sidebar */}
              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3 uppercase text-sm">Price Range</h3>
                  <div className="space-y-2">
                    {[
                      { value: "under-25", label: "Under $25" },
                      { value: "25-50", label: "$25 - $50" },
                      { value: "50-100", label: "$50 - $100" },
                      { value: "100+", label: "$100+" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-${option.value}`}
                          checked={filters.priceRange.includes(option.value)}
                          onCheckedChange={() => handleFilterChange("priceRange", option.value)}
                        />
                        <Label htmlFor={`mobile-${option.value}`} className="text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-medium mb-3 uppercase text-sm">Availability</h3>
                  <div className="space-y-2">
                    {[
                      { value: "in-stock", label: "In Stock" },
                      { value: "limited-edition", label: "Limited Edition" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-${option.value}`}
                          checked={filters.availability.includes(option.value)}
                          onCheckedChange={() => handleFilterChange("availability", option.value)}
                        />
                        <Label htmlFor={`mobile-${option.value}`} className="text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="font-medium mb-3 uppercase text-sm">Rating</h3>
                  <div className="space-y-2">
                    {[
                      { value: "4+", label: "4+ Stars" },
                      { value: "5", label: "5 Stars" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-${option.value}`}
                          checked={filters.rating.includes(option.value)}
                          onCheckedChange={() => handleFilterChange("rating", option.value)}
                        />
                        <Label htmlFor={`mobile-${option.value}`} className="text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-2">
                <Button onClick={clearFilters} variant="outline" className="flex-1">
                  Clear All
                </Button>
                <Button onClick={() => setMobileFiltersOpen(false)} className="flex-1">
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartDrawerItems}
        onUpdateQuantity={updateCartMutation.mutate}
        onRemoveItem={removeCartMutation.mutate}
      />
      <Footer />
    </div>
  );
}