"use client";

import { Suspense, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
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

// Lathe profiles (revolved around Y) — bulbous belly + long neck surahi.
const SURAHI_PROFILE = [
  v2(0.0, 0.0), v2(0.35, 0.0), v2(0.55, 0.05), v2(0.85, 0.32), v2(1.0, 0.78),
  v2(0.92, 1.2), v2(0.6, 1.55), v2(0.42, 1.78), v2(0.39, 2.0), v2(0.39, 2.85),
  v2(0.42, 3.0), v2(0.36, 3.05), v2(0.0, 3.05),
];
const LID_PROFILE = [
  v2(0.44, 0.0), v2(0.45, 0.07), v2(0.4, 0.12), v2(0.3, 0.3), v2(0.16, 0.44),
  v2(0.07, 0.52), v2(0.06, 0.58), v2(0.11, 0.62), v2(0.05, 0.7), v2(0.0, 0.74),
];
const GLASS_PROFILE = [
  v2(0.0, 0.0), v2(0.2, 0.0), v2(0.22, 0.04), v2(0.1, 0.1), v2(0.09, 0.16),
  v2(0.17, 0.24), v2(0.26, 0.38), v2(0.24, 0.52), v2(0.25, 0.55), v2(0.2, 0.56),
];
const SPOUT_CURVE = new THREE.CatmullRomCurve3([
  v3(-0.5, 1.5, 0), v3(-0.95, 1.6, 0), v3(-1.18, 1.95, 0), v3(-1.22, 2.3, 0),
]);
const HANDLE_CURVE = new THREE.CatmullRomCurve3([
  v3(0.5, 2.6, 0), v3(0.98, 2.35, 0), v3(1.02, 1.95, 0), v3(0.62, 1.62, 0),
]);

// Khurja palette: ivory ceramic, cobalt blue, and folk house colours.
const IVORY = "#f7f1e3";
const COBALT = "#1f3f97";
const FOLK = ["#cf3b2e", "#e8b53a", "#3f8fd0", "#5a9b54", "#1f3f97"];

interface Dot {
  position: [number, number, number];
  color: string;
  scale: number;
}

function makeDots(count: number): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    // Sample a point along the belly/neck of the profile.
    const seg = 3 + Math.floor(Math.random() * 7);
    const a = SURAHI_PROFILE[seg];
    const b = SURAHI_PROFILE[seg + 1] ?? a;
    const t = Math.random();
    const r = lerp(a.x, b.x, t) + 0.01;
    const y = lerp(a.y, b.y, t);
    const ang = Math.random() * Math.PI * 2;
    dots.push({
      position: [Math.cos(ang) * r, y, Math.sin(ang) * r],
      color: FOLK[Math.floor(Math.random() * FOLK.length)],
      scale: 0.035 + Math.random() * 0.03,
    });
  }
  return dots;
}

function Ceramic({ sectionRef }: { sectionRef: RefObject<HTMLElement> }) {
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
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
  const dots = useMemo(() => makeDots(46), []);

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
      group.current.rotation.y += delta * (0.18 + e * 0.5);
      group.current.position.y = -1.45 + Math.sin(t * 0.7) * 0.06;
      group.current.rotation.z = Math.sin(t * 0.5) * 0.02 + lerp(0, -0.08, e);
      group.current.scale.setScalar(lerp(1, 1.06, e) + Math.sin(t * 0.7) * 0.005);
    }

    // The lid lifts off and spins — the "reveal".
    if (lid.current) {
      lid.current.position.y = 2.98 + e * 0.7 + Math.sin(t * 1.2) * 0.02 * e;
      lid.current.rotation.y = t * (0.4 + e * 1.2);
      lid.current.position.x = Math.sin(t) * 0.04 * e;
    }

    // The four glasses rise and dance in a carousel.
    cups.current.forEach((cup, i) => {
      if (!cup) return;
      const baseAngle = (i / 4) * Math.PI * 2;
      const angle = baseAngle + t * 0.45 + e * Math.PI * 1.4;
      const radius = lerp(1.0, 2.0, e);
      const lift = lerp(0.05, 1.5, e) + Math.sin(t * 1.3 + i) * 0.12 * (0.3 + e);
      cup.position.set(Math.cos(angle) * radius, lift, Math.sin(angle) * radius);
      cup.rotation.set(lerp(0, 0.4, e), -angle + t * 0.6, lerp(0, 0.25, e));
    });
  });

  return (
    <group ref={group} position={[0, -1.45, 0]}>
      {/* Surahi body */}
      <mesh geometry={surahiGeo} castShadow receiveShadow>
        <meshPhysicalMaterial color={IVORY} roughness={0.25} metalness={0.02} clearcoat={0.8} clearcoatRoughness={0.3} />
      </mesh>
      {/* Spout + handle */}
      <mesh geometry={spoutGeo} castShadow>
        <meshPhysicalMaterial color={IVORY} roughness={0.25} clearcoat={0.8} />
      </mesh>
      <mesh geometry={handleGeo} castShadow>
        <meshPhysicalMaterial color={IVORY} roughness={0.25} clearcoat={0.8} />
      </mesh>
      {/* Hand-painted cobalt belly band */}
      <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.99, 0.045, 16, 90]} />
        <meshStandardMaterial color={COBALT} emissive={COBALT} emissiveIntensity={0.25} roughness={0.3} />
      </mesh>
      {/* Polka dots */}
      {dots.map((d, i) => (
        <mesh key={i} position={d.position} scale={d.scale}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={d.color} emissive={d.color} emissiveIntensity={0.3} roughness={0.4} />
        </mesh>
      ))}

      {/* Floating cobalt lid */}
      <group ref={lid} position={[0, 2.98, 0]}>
        <mesh geometry={lidGeo} castShadow>
          <meshPhysicalMaterial color={COBALT} emissive={COBALT} emissiveIntensity={0.3} roughness={0.2} clearcoat={1} />
        </mesh>
      </group>

      {/* Four matching glasses */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={i} ref={(el) => { cups.current[i] = el; }}>
          <mesh geometry={glassGeo} castShadow receiveShadow>
            <meshPhysicalMaterial color={IVORY} roughness={0.25} clearcoat={0.7} />
          </mesh>
          <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.25, 0.016, 12, 48]} />
            <meshStandardMaterial color={COBALT} emissive={COBALT} emissiveIntensity={0.3} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Magic dust */}
      <Sparkles count={40} scale={[6, 7, 6]} position={[0, 1.5, 0]} size={3.5} speed={0.35} color={COBALT} opacity={0.7} />
      <Sparkles count={24} scale={[5, 6, 5]} position={[0, 1.8, 0]} size={2.5} speed={0.5} color="#e8b53a" opacity={0.8} />
    </group>
  );
}

export interface SurahiSceneProps {
  sectionRef: RefObject<HTMLElement>;
  className?: string;
}

/**
 * Scroll-driven, "magical" ceramic scene: a lathe-built Khurja surahi whose
 * cobalt lid floats off and whose four hand-painted glasses rise and dance as
 * the page scrolls — finished with sparkles and a soft bloom. The real
 * Khurja-scanned model can replace the geometry above later.
 */
export default function SurahiScene({ sectionRef, className }: SurahiSceneProps) {
  return (
    <div className={className}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.4, 7], fov: 42 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <spotLight position={[5, 9, 6]} angle={0.3} penumbra={1} intensity={1.7} castShadow />
          <directionalLight position={[-6, 3, -4]} intensity={0.5} color={COBALT} />
          <Ceramic sectionRef={sectionRef} />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={12} blur={3} far={5} />
          <Environment resolution={256} frames={1}>
            <Lightformer intensity={2.2} position={[0, 4, 4]} scale={[10, 10, 1]} color="white" />
            <Lightformer intensity={1.1} position={[-5, 1, 2]} scale={[4, 8, 1]} color={IVORY} />
          </Environment>
          <EffectComposer>
            <Bloom intensity={0.7} luminanceThreshold={0.55} luminanceSmoothing={0.3} mipmapBlur />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
