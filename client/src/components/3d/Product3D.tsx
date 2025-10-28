import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { Text, RoundedBox, Image } from '@react-three/drei';

interface Product3DProps {
  imageUrl: string;
  name: string;
  price: string;
  position?: [number, number, number];
  scale?: number;
  onHover?: (hovering: boolean) => void;
  onClick?: () => void;
}

export function Product3D({
  imageUrl,
  name,
  price,
  position = [0, 0, 0],
  scale = 1,
  onHover,
  onClick
}: Product3DProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Hover animation
      const targetScale = hovered ? scale * 1.1 : scale;
      groupRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.1);
      
      // Subtle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHover?.(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(false);
  };

  const handleClick = () => {
    setClicked(true);
    onClick?.();
    setTimeout(() => setClicked(false), 150);
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Main product card */}
      <RoundedBox
        args={[2, 2.5, 0.1]}
        radius={0.1}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={hovered ? "#ffffff" : "#f8f9fa"}
          metalness={0.1}
          roughness={0.8}
        />
      </RoundedBox>

      {/* Product image */}
      <Image
        url={imageUrl}
        position={[0, 0.3, 0.06]}
        scale={[1.6, 1.2, 1]}
        transparent
      />

      {/* Product name */}
      <Text
        position={[0, -0.6, 0.06]}
        fontSize={0.15}
        color="#1a1a1a"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
        font="/fonts/Inter-Bold.woff"
      >
        {name.toUpperCase()}
      </Text>

      {/* Price */}
      <Text
        position={[0, -0.9, 0.06]}
        fontSize={0.2}
        color="#ff6b6b"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        ${price}
      </Text>

      {/* Glow effect when hovered */}
      {hovered && (
        <pointLight
          position={[0, 0, 1]}
          intensity={0.5}
          color="#ff6b6b"
          distance={3}
        />
      )}
    </group>
  );
}
