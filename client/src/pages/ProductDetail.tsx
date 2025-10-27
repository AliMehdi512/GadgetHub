import { useState } from "react";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Shield, Clock, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data
  const product = {
    id: "1",
    name: "Premium Design Pack",
    slug: "premium-design-pack",
    description: "A comprehensive collection of premium design assets including UI kits, icons, illustrations, and templates. Perfect for modern web and mobile projects. Includes over 500 components, fully customizable and ready to use.",
    price: "49.99",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
      "https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=1200&q=80",
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80",
      "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=1200&q=80",
    ],
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
  };

  const features = [
    "500+ Premium Components",
    "Fully Customizable",
    "Figma & Sketch Files",
    "Regular Updates",
    "Lifetime Access",
    "Commercial License",
  ];

  const reviews = [
    {
      id: "1",
      userName: "Alex Chen",
      rating: 5,
      title: "Excellent Quality",
      comment: "The design quality is outstanding. Saved me weeks of work on my latest project.",
      isVerified: true,
      date: "2 days ago",
    },
    {
      id: "2",
      userName: "Sarah Johnson",
      rating: 5,
      title: "Worth Every Penny",
      comment: "Best design pack I've purchased. The components are well-organized and easy to customize.",
      isVerified: true,
      date: "1 week ago",
    },
    {
      id: "3",
      userName: "Marcus Lee",
      rating: 4,
      title: "Great Product",
      comment: "Very comprehensive collection. Would love to see more icon variations in future updates.",
      isVerified: true,
      date: "2 weeks ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={0} onCartClick={() => setCartOpen(true)} />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={[]}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
      />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-md overflow-hidden bg-secondary">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="img-product-main"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      selectedImage === idx ? "border-accent" : "border-transparent"
                    }`}
                    data-testid={`button-thumbnail-${idx}`}
                  >
                    <img
                      src={img}
                      alt={`Product view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <div className="space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {product.isLimitedEdition && (
                    <Badge variant="destructive" className="uppercase" data-testid="badge-limited">
                      Limited Edition
                    </Badge>
                  )}
                  <Badge className="uppercase" data-testid="badge-instant">
                    Instant Digital Delivery
                  </Badge>
                  {product.stockCount > 0 && product.stockCount <= 5 && (
                    <Badge variant="destructive" className="uppercase" data-testid="badge-stock">
                      Only {product.stockCount} left
                    </Badge>
                  )}
                </div>

                {/* Title and Rating */}
                <div>
                  <h1 className="text-4xl sm:text-5xl font-heading font-bold uppercase mb-4" data-testid="text-product-name">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Number(product.averageRating)
                              ? "fill-accent text-accent"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground" data-testid="text-review-summary">
                      {product.averageRating} ({product.reviewCount} reviews)
                    </span>
                  </div>

                  <p className="text-4xl font-bold mb-6" data-testid="text-price">
                    ${product.price}
                  </p>
                </div>

                {/* Description */}
                <p className="text-base leading-relaxed text-muted-foreground" data-testid="text-description">
                  {product.description}
                </p>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-heading font-bold uppercase mb-3">
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2" data-testid={`feature-${idx}`}>
                        <Check className="h-5 w-5 text-accent flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Add to Cart */}
                <Button
                  size="lg"
                  className="w-full uppercase font-bold tracking-wide text-lg"
                  data-testid="button-add-to-cart"
                >
                  Add to Cart
                </Button>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                  <div className="text-center">
                    <Download className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <p className="text-xs text-muted-foreground">Instant Download</p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <p className="text-xs text-muted-foreground">Secure Payment</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <p className="text-xs text-muted-foreground">Lifetime Access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-24">
            <Separator className="mb-12" />

            <div className="max-w-4xl">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold uppercase mb-8">
                Customer Reviews
              </h2>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-border rounded-md p-6" data-testid={`review-${review.id}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold" data-testid={`text-reviewer-${review.id}`}>
                            {review.userName}
                          </p>
                          {review.isVerified && (
                            <Badge variant="secondary" className="text-xs" data-testid={`badge-verified-${review.id}`}>
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "fill-accent text-accent" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>

                    <h4 className="font-bold mb-2" data-testid={`text-review-title-${review.id}`}>
                      {review.title}
                    </h4>
                    <p className="text-muted-foreground" data-testid={`text-review-comment-${review.id}`}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
