"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Float, ContactShadows, OrbitControls } from "@react-three/drei";
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
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={ref} castShadow receiveShadow>
        {kind === "torus" && <torusKnotGeometry args={[0.85, 0.27, 220, 36]} />}
        {kind === "sphere" && <icosahedronGeometry args={[1.2, 1]} />}
        {kind === "box" && <boxGeometry args={[1.5, 1.5, 1.5]} />}
        <meshPhysicalMaterial
          color={color}
          roughness={0.18}
          metalness={0.55}
          clearcoat={1}
          clearcoatRoughness={0.25}
          reflectivity={0.6}
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
          <ambientLight intensity={0.4} />
          <spotLight
            position={[6, 8, 6]}
            angle={0.3}
            penumbra={1}
            intensity={1.6}
            castShadow
          />
          <directionalLight position={[-6, 2, -4]} intensity={0.5} color={color} />
          <SpinningModel kind={model} color={color} />
          <ContactShadows
            position={[0, -1.55, 0]}
            opacity={0.35}
            scale={9}
            blur={2.8}
            far={4}
          />
          {/* Procedural studio environment — no network fetch required. */}
          <Environment resolution={256} frames={1}>
            <Lightformer
              intensity={2.4}
              position={[0, 3, 4]}
              scale={[8, 8, 1]}
              color="white"
            />
            <Lightformer
              intensity={1.2}
              position={[-4, 1, 2]}
              scale={[4, 6, 1]}
              color={color}
            />
            <Lightformer
              intensity={1}
              position={[4, -2, 2]}
              scale={[4, 4, 1]}
              color="white"
            />
          </Environment>
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
