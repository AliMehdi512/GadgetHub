import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { use3DHoverEffect } from "./3d/CursorCraftAnimation";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const stock = Number(product.stockCount) || 0;
  const isLowStock = stock > 0 && stock <= 5;
  const isSoldOut = stock === 0;
  const rating = Number(product.averageRating) || 0;
  const [isHovered, setIsHovered] = useState(false);
  const { elementRef, get3DTransform } = use3DHoverEffect();

  return (
    <Link href={`/product/${product.slug}`}>
      <motion.a
        ref={elementRef}
        className="group block" 
        data-testid={`card-product-${product.id}`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ 
          y: -12,
          rotateX: 5,
          rotateY: 5,
          scale: 1.02
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
        style={{
          transformStyle: "preserve-3d",
          ...get3DTransform(8)
        }}
      >
        <motion.div 
          className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-secondary shadow-lg"
          whileHover={{ 
            rotateX: 5,
            rotateY: 5,
            scale: 1.02
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
          style={{
            transformStyle: "preserve-3d",
            boxShadow: isHovered ? 
              "0 25px 50px rgba(0, 0, 0, 0.25), 0 0 30px rgba(255, 107, 107, 0.2)" : 
              "0 4px 15px rgba(0, 0, 0, 0.1)"
          }}
        >
          <motion.img
            src={product.imageUrl || "/placeholder-product.png"}
            alt={product.name}
            className="w-full h-full object-cover"
            data-testid={`img-product-${product.id}`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          {/* Gradient overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isLimitedEdition && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Badge 
                  variant="destructive" 
                  className="uppercase text-xs font-bold backdrop-blur-sm shadow-lg" 
                  data-testid={`badge-limited-${product.id}`}
                >
                  Limited Edition
                </Badge>
              </motion.div>
            )}
            {isLowStock && !isSoldOut && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge 
                  variant="destructive" 
                  className="uppercase text-xs font-bold backdrop-blur-sm shadow-lg" 
                  data-testid={`badge-stock-${product.id}`}
                >
                  Only {stock} left
                </Badge>
              </motion.div>
            )}
            {isSoldOut && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge 
                  variant="secondary" 
                  className="uppercase text-xs font-bold backdrop-blur-sm shadow-lg" 
                  data-testid={`badge-soldout-${product.id}`}
                >
                  Sold Out
                </Badge>
              </motion.div>
            )}
            {product.isDigital && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge 
                  className="bg-gradient-to-r from-primary to-accent text-white uppercase text-xs font-bold backdrop-blur-sm shadow-lg" 
                  data-testid={`badge-instant-${product.id}`}
                >
                  Instant Access
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: "linear-gradient(45deg, rgba(255, 107, 107, 0.1), rgba(100, 255, 218, 0.1))",
              opacity: 0
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.h3 
            className="text-xl sm:text-2xl font-heading font-semibold uppercase mb-1 transition-colors" 
            data-testid={`text-product-name-${product.id}`}
            whileHover={{ 
              color: "#ff6b6b",
              textShadow: "0 0 8px rgba(255, 107, 107, 0.5)"
            }}
          >
            {product.name}
          </motion.h3>
          
          {rating > 0 && (
            <motion.div 
              className="flex items-center gap-1 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Star
                      className={`h-3 w-3 ${
                        star <= rating ? "fill-accent text-accent" : "text-muted"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
              <span className="text-xs text-muted-foreground" data-testid={`text-review-count-${product.id}`}>
                ({product.reviewCount})
              </span>
            </motion.div>
          )}

          <motion.p 
            className="text-xl font-bold"
            data-testid={`text-price-${product.id}`}
            whileHover={{ 
              scale: 1.05,
              color: "#ff6b6b",
              textShadow: "0 0 10px rgba(255, 107, 107, 0.5)"
            }}
            style={{ 
              background: "linear-gradient(45deg, #ff6b6b, #ffa726)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            ${Number(product.price).toFixed(2)}
          </motion.p>
        </motion.div>

        {/* 3D floating particles on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-accent rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${20 + (i % 2) * 20}%`,
                }}
                animate={{
                  y: [-10, -30, -10],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.a>
    </Link>
  );
}
