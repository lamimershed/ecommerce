"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows, OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";

type ModelKind = "torus" | "sphere" | "box";

function SpinningModel({ kind, color }: { kind: ModelKind; color: string }) {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.4;
      ref.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} castShadow>
        {kind === "torus" && <torusKnotGeometry args={[0.9, 0.28, 180, 32]} />}
        {kind === "sphere" && <icosahedronGeometry args={[1.2, 1]} />}
        {kind === "box" && <boxGeometry args={[1.6, 1.6, 1.6]} />}
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.6}
          flatShading={kind === "sphere"}
        />
      </mesh>
    </Float>
  );
}

export interface ProductSceneProps {
  model?: ModelKind;
  color?: string;
  className?: string;
  interactive?: boolean;
}

/**
 * A self-contained React Three Fiber canvas that renders a floating, rotating
 * representation of a product. Runs entirely client-side.
 */
export default function ProductScene({
  model = "torus",
  color = "#7c5cff",
  className,
  interactive = true,
}: ProductSceneProps) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.5, 5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.4} castShadow />
          <directionalLight position={[-5, 2, -3]} intensity={0.6} color={color} />
          <SpinningModel kind={model} color={color} />
          <ContactShadows
            position={[0, -1.6, 0]}
            opacity={0.5}
            scale={10}
            blur={2.5}
            far={4}
          />
          <Environment preset="city" />
          {interactive && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.8}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
