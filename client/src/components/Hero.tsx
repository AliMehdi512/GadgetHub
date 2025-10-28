import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Scene3D } from "./3d/Scene3D";
import { FloatingCube } from "./3d/FloatingCube";
import { AnimatedBackground, FloatingShapes } from "./3d/AnimatedBackground";
import { AnimatedSnowballs, CSS3DSnowfall, InteractiveSnowballs } from "./3d/AnimatedSnowballs";
import { motion } from "framer-motion";

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export function Hero({ title, subtitle, ctaText, ctaLink, backgroundImage }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background with Animated Snowballs */}
      <div className="absolute inset-0 opacity-15">
        <Scene3D>
          <AnimatedBackground count={1500} speed={0.2} />
          <FloatingShapes />
          <AnimatedSnowballs count={200} area={{ width: 60, height: 40, depth: 30 }} />
        </Scene3D>
      </div>

      {/* Interactive 3D Snowballs Layer */}
      <div className="absolute inset-0 opacity-30">
        <Scene3D>
          <InteractiveSnowballs count={40} />
        </Scene3D>
      </div>

      {/* CSS Snowfall Overlay */}
      <CSS3DSnowfall count={80} />

      {/* Background Image with Motion */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-60"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 0.5, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <img
          src={backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
          style={{
            filter: "blur(0.5px) brightness(0.9) contrast(1.1)"
          }}
        />
        {/* Enhanced winter gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-black/60 to-cyan-900/30" />
        
        {/* Frosty vignette effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(135, 206, 235, 0.1) 50%, rgba(0, 100, 200, 0.2) 100%)"
          }}
        />
      </motion.div>

      {/* 3D Floating Elements */}
      <div className="absolute inset-0 pointer-events-none z-5">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <Scene3D>
            <FloatingCube
              position={[0, 0, 0]}
              size={1.2}
              color="#87ceeb"
              rotationSpeed={0.5}
              floatAmplitude={0.3}
              text="❄"
            />
          </Scene3D>
        </motion.div>
        
        <motion.div 
          className="absolute top-40 right-20 w-24 h-24"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Scene3D>
            <FloatingCube
              position={[0, 0, 0]}
              size={0.8}
              color="#e0f6ff"
              rotationSpeed={-0.3}
              floatAmplitude={0.5}
              text="⚡"
            />
          </Scene3D>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-40 left-1/4 w-28 h-28"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <Scene3D>
            <FloatingCube
              position={[0, 0, 0]}
              size={1}
              color="#b8e6ff"
              rotationSpeed={0.7}
              floatAmplitude={0.4}
              text="⭐"
            />
          </Scene3D>
        </motion.div>

        {/* Additional winter-themed floating elements */}
        <motion.div 
          className="absolute top-60 right-1/3 w-20 h-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <Scene3D>
            <FloatingCube
              position={[0, 0, 0]}
              size={0.6}
              color="#ffffff"
              rotationSpeed={0.4}
              floatAmplitude={0.6}
              text="❅"
            />
          </Scene3D>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-bold uppercase tracking-tight mb-6"
          data-testid="text-hero-title"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          style={{
            background: "linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff80, #00ffff, #0080ff, #8000ff, #ff0080)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            backgroundSize: "400% 400%",
            animation: "rainbow 3s ease infinite",
            textShadow: "0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4), 0 4px 20px rgba(0, 0, 0, 0.8)",
            filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))"
          }}
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p
            className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-8 font-medium"
            data-testid="text-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.7)"
            }}
          >
            {subtitle}
          </motion.p>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Link href={ctaLink}>
            <Button
              size="lg"
              className="group uppercase font-bold tracking-wide text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-8 bg-gradient-to-r from-accent via-orange-500 to-red-500 hover:from-accent/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-2xl hover:shadow-accent/50 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 border-2 border-white/20 backdrop-blur-sm"
              data-testid="button-hero-cta"
              style={{
                boxShadow: "0 15px 50px rgba(255, 107, 107, 0.4), 0 0 30px rgba(255, 107, 107, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
              }}
            >
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm">
            <motion.div 
              className="w-1 h-3 bg-gradient-to-b from-white to-accent rounded-full mt-2"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span className="text-xs mt-3 uppercase tracking-widest font-bold" style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)" }}>
            Scroll to Explore
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
