import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Text } from '@react-three/drei';

interface FloatingCubeProps {
  position?: [number, number, number];
  size?: number;
  color?: string;
  rotationSpeed?: number;
  floatAmplitude?: number;
  text?: string;
}

export function FloatingCube({
  position = [0, 0, 0],
  size = 1,
  color = '#ff6b6b',
  rotationSpeed = 1,
  floatAmplitude = 0.5,
  text
}: FloatingCubeProps) {
  const meshRef = useRef<Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate the cube
      meshRef.current.rotation.x += 0.01 * rotationSpeed;
      meshRef.current.rotation.y += 0.01 * rotationSpeed;
      
      // Float up and down
      meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime) * floatAmplitude;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {text && (
        <Text
          position={[0, size + 0.5, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          {text}
        </Text>
      )}
    </group>
  );
}
