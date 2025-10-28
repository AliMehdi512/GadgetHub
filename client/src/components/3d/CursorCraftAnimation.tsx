import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

interface CraftParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  scale: number;
  rotation: number;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

interface CursorCraftAnimationProps {
  enabled?: boolean;
  intensity?: number;
  craftEmojis?: string[];
}

export function CursorCraftAnimation({ 
  enabled = true, 
  intensity = 3,
  craftEmojis = ['✨', '🎨', '⚒️', '🛠️', '🎯', '💎', '🌟', '⭐', '🔨', '✂️', '📐', '🎪', '🎭', '🎬', '🎪']
}: CursorCraftAnimationProps) {
  const [particles, setParticles] = useState<CraftParticle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const particleIdRef = useRef(0);
  const lastEmitTime = useRef(0);
  const moveTimeoutRef = useRef<NodeJS.Timeout>();
  const [location] = useLocation();

  const createParticle = useCallback((x: number, y: number): CraftParticle => {
    const emoji = craftEmojis[Math.floor(Math.random() * craftEmojis.length)];
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 1;
    
    return {
      id: particleIdRef.current++,
      x,
      y,
      emoji,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed - 1, // Slight upward bias
      },
      life: 100,
      maxLife: 100,
    };
  }, [craftEmojis]);

  const updateParticles = useCallback(() => {
    setParticles(prev => prev
      .map(particle => ({
        ...particle,
        x: particle.x + particle.velocity.x,
        y: particle.y + particle.velocity.y,
        rotation: particle.rotation + 2,
        velocity: {
          x: particle.velocity.x * 0.99,
          y: particle.velocity.y + 0.1, // Gravity
        },
        life: particle.life - 1,
      }))
      .filter(particle => particle.life > 0)
    );
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    
    setMousePos({ x, y });
    setIsMoving(true);
    
    // Clear previous timeout
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
    }
    
    // Set timeout to detect when mouse stops moving
    moveTimeoutRef.current = setTimeout(() => {
      setIsMoving(false);
    }, 100);

    // Check if we're on home page and not hovering over a button
    const isHomePage = location === '/';
    const target = e.target as HTMLElement;
    const isButton = target?.closest('button, [role="button"], a[href]') !== null;
    
    if (!enabled || !isHomePage || isButton) return;

    const now = Date.now();
    if (now - lastEmitTime.current > 150 / intensity) { // Throttle particle creation
      lastEmitTime.current = now;
      
      // Create multiple particles for intensity
      for (let i = 0; i < intensity; i++) {
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        
        setParticles(prev => [...prev, createParticle(x + offsetX, y + offsetY)]);
      }
    }
  }, [enabled, intensity, createParticle, location]);

  const handleMouseEnter = useCallback(() => {
    setIsMoving(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsMoving(false);
  }, []);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isButton = target?.closest('button, [role="button"], a[href]') !== null;
    setIsHoveringButton(isButton);
  }, []);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isButton = target?.closest('button, [role="button"], a[href]') !== null;
    if (!isButton) {
      setIsHoveringButton(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, [enabled, handleMouseMove, handleMouseEnter, handleMouseLeave, handleMouseOver, handleMouseOut]);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(updateParticles, 16); // ~60fps
    return () => clearInterval(interval);
  }, [enabled, updateParticles]);

  if (!enabled) return null;

  // Only show cursor and particles on home page
  const isHomePage = location === '/';
  const shouldShowCursor = isHomePage && isMoving && !isHoveringButton;

  return (
    <>
      {/* Custom cursor when moving - only on home page and not over buttons */}
      {isHomePage && (
        <motion.div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: mousePos.x - 16,
            top: mousePos.y - 16,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: shouldShowCursor ? 1 : 0, 
            scale: shouldShowCursor ? 1 : 0,
            rotate: shouldShowCursor ? 360 : 0 
          }}
          transition={{ 
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
            rotate: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
        >
          <div className="w-8 h-8 flex items-center justify-center text-2xl">
            🎨
          </div>
        </motion.div>
      )}

      {/* Craft particles - only on home page */}
      {isHomePage && (
        <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute text-lg select-none"
                style={{
                  left: particle.x,
                  top: particle.y,
                }}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  rotate: particle.rotation
                }}
                animate={{ 
                  opacity: particle.life / particle.maxLife,
                  scale: particle.scale,
                  rotate: particle.rotation,
                  x: 0,
                  y: 0,
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0,
                  transition: { duration: 0.2 }
                }}
                transition={{
                  opacity: { duration: 0.1 },
                  scale: { duration: 0.2, type: "spring" },
                }}
              >
                <span 
                  style={{
                    filter: `drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))`,
                    textShadow: '0 0 10px rgba(255, 215, 0, 0.8)'
                  }}
                >
                  {particle.emoji}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Cursor trail effect - only on home page */}
      {isHomePage && (
        <motion.div
          className="fixed pointer-events-none z-[9997]"
          style={{
            left: mousePos.x - 2,
            top: mousePos.y - 2,
            width: 4,
            height: 4,
          }}
          animate={{
            scale: shouldShowCursor ? [1, 1.5, 1] : 0,
            opacity: shouldShowCursor ? [0.8, 0.4, 0] : 0,
          }}
          transition={{
            scale: { duration: 0.6, repeat: Infinity },
            opacity: { duration: 0.6, repeat: Infinity },
          }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(255, 165, 0, 0.4) 50%, transparent 100%)',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)'
            }}
          />
        </motion.div>
      )}
    </>
  );
}

// Custom hook for 3D hover effects
export function use3DHoverEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePosition({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0.5, y: 0.5 });
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  const get3DTransform = (intensity = 10) => {
    const xRotation = (mousePosition.y - 0.5) * intensity;
    const yRotation = (mousePosition.x - 0.5) * -intensity;
    
    return {
      transform: `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`,
      transformStyle: 'preserve-3d' as const,
    };
  };

  return { elementRef, get3DTransform, mousePosition };
}
