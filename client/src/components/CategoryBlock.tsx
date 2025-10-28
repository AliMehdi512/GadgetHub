import { Link } from "wouter";
import { motion } from "framer-motion";
import { use3DHoverEffect } from "./3d/CursorCraftAnimation";

interface CategoryBlockProps {
  name: string;
  slug: string;
  imageUrl: string;
}

export function CategoryBlock({ name, slug, imageUrl }: CategoryBlockProps) {
  const { elementRef, get3DTransform } = use3DHoverEffect();

  return (
    <Link href={`/category/${slug}`}>
      <motion.a 
        ref={elementRef}
        className="group block relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-xl shadow-lg" 
        data-testid={`category-block-${slug}`}
        whileHover={{ 
          scale: 1.05,
          rotateX: 8,
          rotateY: -8,
          z: 50
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 15 
        }}
        style={{
          transformStyle: "preserve-3d",
          ...get3DTransform(12)
        }}
      >
        <motion.img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          whileHover={{ 
            background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.1), transparent)"
          }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h3
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold uppercase text-white tracking-tight text-center px-4"
            data-testid={`text-category-${slug}`}
            whileHover={{ 
              scale: 1.1,
              textShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
              color: "#ffd700"
            }}
            transition={{ duration: 0.3 }}
            style={{
              filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8))"
            }}
          >
            {name}
          </motion.h3>
        </div>

        {/* 3D depth overlay */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(0, 0, 0, 0.1) 100%)",
            opacity: 0
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Glowing border effect */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-transparent"
          whileHover={{ 
            borderColor: "rgba(255, 215, 0, 0.6)",
            boxShadow: "0 0 30px rgba(255, 215, 0, 0.3)"
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.a>
    </Link>
  );
}
