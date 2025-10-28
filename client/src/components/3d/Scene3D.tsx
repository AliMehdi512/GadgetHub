import { Canvas } from '@react-three/fiber';
import { Suspense, ReactNode } from 'react';
import { OrbitControls } from '@react-three/drei';

interface Scene3DProps {
  children: ReactNode;
  className?: string;
  enableControls?: boolean;
  cameraPosition?: [number, number, number];
}

export function Scene3D({ 
  children, 
  className = "", 
  enableControls = false,
  cameraPosition = [0, 0, 5]
}: Scene3DProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: cameraPosition, fov: 75 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight
            position={[0, 10, 5]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
          />
          {children}
          {enableControls && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
