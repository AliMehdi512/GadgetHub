import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface Snowball {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
  size: number;
  opacity: number;
  rotationSpeed: number;
}

interface AnimatedSnowballsProps {
  count?: number;
  area?: { width: number; height: number; depth: number };
}

export function AnimatedSnowballs({ 
  count = 150, 
  area = { width: 50, height: 30, depth: 20 } 
}: AnimatedSnowballsProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const snowballs = useMemo<Snowball[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * area.width,
        Math.random() * area.height,
        (Math.random() - 0.5) * area.depth
      ],
      velocity: [
        (Math.random() - 0.5) * 0.02, // slight horizontal drift
        -Math.random() * 0.05 - 0.01, // falling speed
        (Math.random() - 0.5) * 0.01  // slight depth movement
      ],
      size: Math.random() * 0.15 + 0.05, // varied sizes
      opacity: Math.random() * 0.8 + 0.2, // varied opacity
      rotationSpeed: (Math.random() - 0.5) * 0.02
    }));
  }, [count, area]);

  const snowballRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    snowballRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      
      const snowball = snowballs[index];
      
      // Update position
      mesh.position.x += snowball.velocity[0];
      mesh.position.y += snowball.velocity[1];
      mesh.position.z += snowball.velocity[2];
      
      // Add some wind effect
      mesh.position.x += Math.sin(state.clock.elapsedTime + index) * 0.001;
      
      // Rotate the snowball
      mesh.rotation.x += snowball.rotationSpeed;
      mesh.rotation.y += snowball.rotationSpeed * 0.7;
      
      // Reset position when snowball goes off screen
      if (mesh.position.y < -area.height / 2) {
        mesh.position.y = area.height / 2;
        mesh.position.x = (Math.random() - 0.5) * area.width;
        mesh.position.z = (Math.random() - 0.5) * area.depth;
      }
      
      // Keep snowballs within horizontal bounds
      if (Math.abs(mesh.position.x) > area.width / 2) {
        mesh.position.x = (Math.random() - 0.5) * area.width;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {snowballs.map((snowball, index) => (
        <Sphere
          key={snowball.id}
          ref={(ref) => {
            if (ref) snowballRefs.current[index] = ref;
          }}
          args={[snowball.size, 8, 8]}
          position={snowball.position}
        >
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={snowball.opacity}
            roughness={0.1}
            metalness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </Sphere>
      ))}
    </group>
  );
}

// 2D CSS-based snowfall for backgrounds
export function CSS3DSnowfall({ count = 50 }: { count?: number }) {
  const snowflakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      animationDuration: Math.random() * 8 + 5, // 5-13 seconds
      animationDelay: Math.random() * 5, // 0-5 seconds delay
      size: Math.random() * 8 + 4, // 4-12px
      opacity: Math.random() * 0.7 + 0.3, // 0.3-1 opacity
      blur: Math.random() * 2, // 0-2px blur for depth
    }));
  }, [count]);

  return (
    <>
      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-100vh) translateX(0px) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(-90vh) translateX(10px) scale(1);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(-50px) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes sway {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(20px);
          }
        }
        
        .snowflake {
          position: fixed;
          top: -10px;
          color: rgba(255, 255, 255, 0.8);
          user-select: none;
          cursor: default;
          animation-name: snowfall, sway;
          animation-timing-function: linear, ease-in-out;
          animation-iteration-count: infinite, infinite;
          z-index: 1;
          pointer-events: none;
        }
      `}</style>
      
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s, ${flake.animationDuration * 0.5}s`,
            animationDelay: `${flake.animationDelay}s, ${flake.animationDelay}s`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            filter: `blur(${flake.blur}px)`,
            textShadow: `0 0 ${flake.size/2}px rgba(255, 255, 255, 0.8)`
          }}
        >
          ❄
        </div>
      ))}
    </>
  );
}

// Interactive 3D Snowballs that react to mouse
export function InteractiveSnowballs({ count = 30 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const snowballs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      basePosition: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      ] as [number, number, number],
      size: Math.random() * 0.3 + 0.1,
      followSpeed: Math.random() * 0.02 + 0.005,
      floatAmplitude: Math.random() * 0.5 + 0.2,
      floatSpeed: Math.random() * 2 + 1
    }));
  }, [count]);

  const meshRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    meshRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      
      const snowball = snowballs[index];
      const time = state.clock.elapsedTime;
      
      // Mouse interaction
      const targetX = snowball.basePosition[0] + mousePosition.current.x * 2;
      const targetY = snowball.basePosition[1] + mousePosition.current.y * 2;
      
      // Smooth follow
      mesh.position.x += (targetX - mesh.position.x) * snowball.followSpeed;
      mesh.position.y += (targetY - mesh.position.y) * snowball.followSpeed;
      
      // Floating animation
      mesh.position.z = snowball.basePosition[2] + 
        Math.sin(time * snowball.floatSpeed + index) * snowball.floatAmplitude;
      
      // Gentle rotation
      mesh.rotation.x = time * 0.5 + index;
      mesh.rotation.y = time * 0.3 + index * 0.5;
    });
  });

  return (
    <group ref={groupRef}>
      {snowballs.map((snowball, index) => (
        <Sphere
          key={snowball.id}
          ref={(ref) => {
            if (ref) meshRefs.current[index] = ref;
          }}
          args={[snowball.size, 12, 12]}
          position={snowball.basePosition}
        >
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
            roughness={0.0}
            metalness={0.0}
            emissive="#87ceeb"
            emissiveIntensity={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.0}
          />
        </Sphere>
      ))}
    </group>
  );
}
