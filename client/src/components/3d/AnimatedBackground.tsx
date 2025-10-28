import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { Mesh, BufferGeometry, BufferAttribute } from 'three';
import * as random from 'maath/random/dist/maath-random.esm';

interface AnimatedBackgroundProps {
  count?: number;
  speed?: number;
}

export function AnimatedBackground({ count = 1000, speed = 0.5 }: AnimatedBackgroundProps) {
  const ref = useRef<Points>(null);
  
  // Generate random positions for particles
  const [sphere] = useMemo(() => [random.inSphere(new Float32Array(count * 3), { radius: 10 })], [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * speed * 0.1;
      ref.current.rotation.y -= delta * speed * 0.15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffa726"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

// Floating geometric shapes for visual interest
export function FloatingShapes() {
  const shapes = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 20; i++) {
      positions.push([
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      ]);
    }
    return positions;
  }, []);

  return (
    <>
      {shapes.map((position, index) => (
        <FloatingShape
          key={index}
          position={position as [number, number, number]}
          shapeType={index % 3}
          delay={index * 0.2}
        />
      ))}
    </>
  );
}

interface FloatingShapeProps {
  position: [number, number, number];
  shapeType: number;
  delay: number;
}

function FloatingShape({ position, shapeType, delay }: FloatingShapeProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.rotation.x = time * 0.5;
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(time) * 2;
    }
  });

  const renderShape = () => {
    switch (shapeType) {
      case 0:
        return <boxGeometry args={[0.5, 0.5, 0.5]} />;
      case 1:
        return <sphereGeometry args={[0.3, 8, 8]} />;
      case 2:
        return <octahedronGeometry args={[0.4]} />;
      default:
        return <boxGeometry args={[0.5, 0.5, 0.5]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position}>
      {renderShape()}
      <meshStandardMaterial
        color="#64ffda"
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  );
}
