"use client";

import { Suspense, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { palette, folkColors } from "@/lib/theme";
import { Surahi } from "@/components/product/surahi";
import { Glasses } from "@/components/product/glasses";

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}
function smooth(t: number) {
  return t * t * (3 - 2 * t);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const SCENE_Y = -1.4;

/* Camera keyframes — scroll is the director. Spherical pose (radius, azimuth,
 * height) + lookAt target, lerped by scroll progress. */
interface Key {
  p: number;
  r: number;
  az: number;
  y: number;
  t: [number, number, number];
}
const KEYS: Key[] = [
  { p: 0.0, r: 6.0, az: 0.0, y: 0.7, t: [0, 0.3, 0] }, // Beat 1 — front idle
  { p: 0.13, r: 6.0, az: 0.08, y: 0.7, t: [0, 0.3, 0] },
  { p: 0.35, r: 4.6, az: Math.PI, y: 0.5, t: [0, 0.4, 0] }, // Beat 2 — orbit + dolly
  { p: 0.55, r: 2.5, az: Math.PI * 1.06, y: 0.2, t: [0, 0.35, 0] }, // Beat 3 — push in
  { p: 0.75, r: 7.0, az: Math.PI * 1.18, y: 1.7, t: [0, -0.15, 0] }, // Beat 4 — crane, tablescape
  { p: 1.0, r: 5.6, az: Math.PI * 0.92, y: 0.6, t: [0, 0.1, 0] }, // Beat 5 — settle
];

function readProgress(container: HTMLElement | null) {
  if (!container) return 0;
  const rect = container.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  if (total <= 0) return 0;
  return clamp(-rect.top / total, 0, 1);
}

function CameraDirector({
  containerRef,
  progressRef,
  frameScale,
}: {
  containerRef: RefObject<HTMLElement>;
  progressRef: RefObject<number>;
  frameScale: number;
}) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.3, 0));

  useFrame(() => {
    const p = readProgress(containerRef.current);
    (progressRef as React.MutableRefObject<number>).current = p;

    let a = KEYS[0];
    let b = KEYS[KEYS.length - 1];
    for (let i = 0; i < KEYS.length - 1; i++) {
      if (p >= KEYS[i].p && p <= KEYS[i + 1].p) {
        a = KEYS[i];
        b = KEYS[i + 1];
        break;
      }
    }
    const tt = a.p === b.p ? 0 : smooth((p - a.p) / (b.p - a.p));
    const r = lerp(a.r, b.r, tt) * frameScale;
    const az = lerp(a.az, b.az, tt);
    const y = lerp(a.y, b.y, tt) * (frameScale > 1 ? 1.05 : 1);

    camera.position.set(Math.sin(az) * r, SCENE_Y + 1.4 + y, Math.cos(az) * r);
    target.current.set(
      lerp(a.t[0], b.t[0], tt),
      SCENE_Y + 1.4 + lerp(a.t[1], b.t[1], tt),
      lerp(a.t[2], b.t[2], tt)
    );
    camera.lookAt(target.current);
  });

  return null;
}

/** Painted dots that "escape" the ceramic and drift up during Beat 2. */
function EscapingDots({
  progressRef,
  count,
}: {
  progressRef: RefObject<number>;
  count: number;
}) {
  const group = useRef<THREE.Group>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.sin(i * 12.9) * 0.5) * 2.4,
        z: (Math.cos(i * 7.7) * 0.5) * 2.4,
        speed: 0.2 + (i % 5) * 0.05,
        color: folkColors[i % folkColors.length],
        phase: i,
      })),
    [count]
  );

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    const beat = clamp((p - 0.15) / 0.2, 0, 1) * clamp((0.55 - p) / 0.2, 0, 1);
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.children.forEach((child, i) => {
        const s = seeds[i];
        const rise = ((t * s.speed + s.phase) % 3);
        child.position.set(s.x, SCENE_Y + 0.4 + rise, s.z);
        const sc = beat * (0.05 + 0.03 * Math.sin(t + s.phase));
        child.scale.setScalar(Math.max(0, sc));
      });
      group.current.visible = beat > 0.001;
    }
  });

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/** Cheap soft ground shadow (radial-gradient sprite) — no shadow maps. */
function ShadowBlob() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, "rgba(30,25,20,0.5)");
    g.addColorStop(1, "rgba(30,25,20,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, SCENE_Y + 0.02, 0]}>
      <planeGeometry args={[6, 6]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

export function Experience({
  containerRef,
  mobile,
}: {
  containerRef: RefObject<HTMLElement>;
  mobile: boolean;
}) {
  const progressRef = useRef(0);
  const frameScale = mobile ? 1.28 : 1;
  const dust = mobile ? 6 : 16;
  const escaping = mobile ? 6 : 12;

  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: [0, 0.5, 6], fov: mobile ? 52 : 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />
      <Suspense fallback={null}>
        {/* Baked-look lighting: 1 ambient + 1 directional (mobile perf budget). */}
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 6, 5]} intensity={1.15} color={"#fff6e6"} />

        <CameraDirector
          containerRef={containerRef}
          progressRef={progressRef}
          frameScale={frameScale}
        />

        <group position={[0, SCENE_Y, 0]}>
          <Surahi />
          <Glasses progressRef={progressRef} />
        </group>
        <ShadowBlob />
        <EscapingDots progressRef={progressRef} count={escaping} />

        <Sparkles
          count={dust}
          scale={[7, 6, 7]}
          position={[0, 0.4, 0]}
          size={3}
          speed={0.06}
          noise={0.15}
          color={palette.cream}
          opacity={0.4}
        />
      </Suspense>
    </Canvas>
  );
}
