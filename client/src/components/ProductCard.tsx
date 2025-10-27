import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const stock = Number(product.stockCount) || 0;
  const isLowStock = stock > 0 && stock <= 5;
  const isSoldOut = stock === 0;
  const rating = Number(product.averageRating) || 0;

  return (
    <Link href={`/product/${product.slug}`}>
      <a className="group block" data-testid={`card-product-${product.id}`}>
        <div className="relative aspect-square mb-4 overflow-hidden rounded-md bg-secondary">
          <img
            src={product.imageUrl || "/placeholder-product.png"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-product-${product.id}`}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.isLimitedEdition && (
              <Badge variant="destructive" className="uppercase text-xs font-bold" data-testid={`badge-limited-${product.id}`}>
                Limited Edition
              </Badge>
            )}
            {isLowStock && !isSoldOut && (
              <Badge variant="destructive" className="uppercase text-xs font-bold" data-testid={`badge-stock-${product.id}`}>
                Only {stock} left
              </Badge>
            )}
            {isSoldOut && (
              <Badge variant="secondary" className="uppercase text-xs font-bold" data-testid={`badge-soldout-${product.id}`}>
                Sold Out
              </Badge>
            )}
            {product.isDigital && (
              <Badge className="bg-primary text-primary-foreground uppercase text-xs font-bold" data-testid={`badge-instant-${product.id}`}>
                Instant Access
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-heading font-semibold uppercase mb-1 group-hover:text-accent transition-colors" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= rating ? "fill-accent text-accent" : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground" data-testid={`text-review-count-${product.id}`}>
                ({product.reviewCount})
              </span>
            </div>
          )}

          <p className="text-xl font-medium" data-testid={`text-price-${product.id}`}>
            ${Number(product.price).toFixed(2)}
          </p>
        </div>
      </a>
    </Link>
  );
}
