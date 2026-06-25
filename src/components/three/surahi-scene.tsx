"use client";

import { Suspense, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
function easeInOut(p: number) {
  return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const v2 = (x: number, y: number) => new THREE.Vector2(x, y);
const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

// Lathe profiles (revolved around the Y axis) approximating the surahi + glass.
// Bulbous belly + long straight neck, matching the real Khurja piece.
const SURAHI_PROFILE = [
  v2(0.0, 0.0), v2(0.35, 0.0), v2(0.55, 0.05), v2(0.85, 0.32), v2(1.0, 0.78),
  v2(0.92, 1.2), v2(0.6, 1.55), v2(0.42, 1.78), v2(0.39, 2.0), v2(0.39, 2.85),
  v2(0.42, 3.0), v2(0.36, 3.05), v2(0.0, 3.05),
];
// Cobalt domed lid with a pointed knob.
const LID_PROFILE = [
  v2(0.44, 0.0), v2(0.45, 0.07), v2(0.4, 0.12), v2(0.3, 0.3), v2(0.16, 0.44),
  v2(0.07, 0.52), v2(0.06, 0.58), v2(0.11, 0.62), v2(0.05, 0.7), v2(0.0, 0.74),
];
// Pedestal egg-cup glass.
const GLASS_PROFILE = [
  v2(0.0, 0.0), v2(0.2, 0.0), v2(0.22, 0.04), v2(0.1, 0.1), v2(0.09, 0.16),
  v2(0.17, 0.24), v2(0.26, 0.38), v2(0.24, 0.52), v2(0.25, 0.55), v2(0.2, 0.56),
];

// Curved swan spout and C-handle, built as tubes along Catmull-Rom curves.
const SPOUT_CURVE = new THREE.CatmullRomCurve3([
  v3(-0.5, 1.5, 0), v3(-0.95, 1.6, 0), v3(-1.18, 1.95, 0), v3(-1.22, 2.3, 0),
]);
const HANDLE_CURVE = new THREE.CatmullRomCurve3([
  v3(0.5, 2.6, 0), v3(0.98, 2.35, 0), v3(1.02, 1.95, 0), v3(0.62, 1.62, 0),
]);

const BODY = "#f2ecdf";
const CREAM = "#f2ecdf";
const COBALT = "#21409a";

function Ceramic({ sectionRef }: { sectionRef: RefObject<HTMLElement> }) {
  const group = useRef<THREE.Group>(null);
  const cups = useRef<(THREE.Group | null)[]>([]);

  const [surahiGeo, lidGeo, glassGeo, spoutGeo, handleGeo] = useMemo(
    () => [
      new THREE.LatheGeometry(SURAHI_PROFILE, 64),
      new THREE.LatheGeometry(LID_PROFILE, 64),
      new THREE.LatheGeometry(GLASS_PROFILE, 48),
      new THREE.TubeGeometry(SPOUT_CURVE, 40, 0.12, 16, false),
      new THREE.TubeGeometry(HANDLE_CURVE, 40, 0.07, 14, false),
    ],
    []
  );

  useFrame((state, delta) => {
    const el = sectionRef.current;
    let p = 0;
    if (el) {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total > 0) p = clamp(-rect.top / total, 0, 1);
    }
    const e = easeInOut(p);
    const t = state.clock.elapsedTime;

    if (group.current) {
      group.current.rotation.y += delta * 0.25;
      group.current.rotation.y += delta * e * 0.6; // scroll accelerates the spin
      group.current.position.y = -1.45 + Math.sin(t * 0.8) * 0.04;
      group.current.rotation.z = lerp(0, -0.12, e);
      const s = lerp(1, 1.08, e);
      group.current.scale.setScalar(s);
    }

    // Cups bloom outward and rise as the page scrolls.
    cups.current.forEach((cup, i) => {
      if (!cup) return;
      const baseAngle = (i / 4) * Math.PI * 2;
      const angle = baseAngle + t * 0.3 + e * Math.PI;
      const radius = lerp(0.95, 2.2, e);
      cup.position.set(
        Math.cos(angle) * radius,
        lerp(0.02, 0.5 + Math.sin(t + i) * 0.06, e),
        Math.sin(angle) * radius
      );
      cup.rotation.y = -angle + t * 0.5;
    });
  });

  return (
    <group ref={group} position={[0, -1.45, 0]}>
      {/* Surahi body */}
      <mesh geometry={surahiGeo} castShadow receiveShadow>
        <meshStandardMaterial color={BODY} roughness={0.4} metalness={0.04} />
      </mesh>
      {/* Curved spout + C-handle */}
      <mesh geometry={spoutGeo} castShadow>
        <meshStandardMaterial color={BODY} roughness={0.4} metalness={0.04} />
      </mesh>
      <mesh geometry={handleGeo} castShadow>
        <meshStandardMaterial color={BODY} roughness={0.4} metalness={0.04} />
      </mesh>
      {/* Painted cobalt band around the belly */}
      <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.99, 0.045, 16, 80]} />
        <meshStandardMaterial color={COBALT} roughness={0.35} />
      </mesh>
      {/* Cobalt domed lid with knob */}
      <mesh geometry={lidGeo} position={[0, 2.98, 0]} castShadow>
        <meshStandardMaterial color={COBALT} roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Four matching glasses */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            cups.current[i] = el;
          }}
        >
          <mesh geometry={glassGeo} castShadow receiveShadow>
            <meshStandardMaterial color={CREAM} roughness={0.5} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.25, 0.018, 12, 48]} />
            <meshStandardMaterial color={COBALT} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export interface SurahiSceneProps {
  sectionRef: RefObject<HTMLElement>;
  className?: string;
}

/**
 * Scroll-driven ceramic scene: a lathe-built surahi pitcher with four glasses
 * that spin and bloom outward as the page scrolls. The real Khurja-scanned
 * model can be dropped in later by swapping the geometry above.
 */
export default function SurahiScene({ sectionRef, className }: SurahiSceneProps) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.4, 7], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 9, 6]} angle={0.3} penumbra={1} intensity={1.6} castShadow />
          <directionalLight position={[-6, 3, -4]} intensity={0.5} color={COBALT} />
          <Ceramic sectionRef={sectionRef} />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.35} scale={12} blur={3} far={5} />
          <Environment resolution={256} frames={1}>
            <Lightformer intensity={2.2} position={[0, 4, 4]} scale={[10, 10, 1]} color="white" />
            <Lightformer intensity={1.1} position={[-5, 1, 2]} scale={[4, 8, 1]} color={CREAM} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
