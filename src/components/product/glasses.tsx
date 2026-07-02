"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "@/lib/theme";

const v2 = (x: number, y: number) => new THREE.Vector2(x, y);

const GLASS_PROFILE = [
  v2(0.0, 0.0), v2(0.2, 0.0), v2(0.22, 0.04), v2(0.1, 0.1), v2(0.09, 0.16),
  v2(0.17, 0.24), v2(0.26, 0.38), v2(0.24, 0.52), v2(0.25, 0.55), v2(0.2, 0.56),
];

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}
function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// Where the four glasses settle around the pitcher (a tablescape).
const SEATS = [
  { angle: 0.6, radius: 1.75 },
  { angle: 2.1, radius: 1.95 },
  { angle: 3.7, radius: 1.8 },
  { angle: 5.1, radius: 2.0 },
];

/**
 * The four matching glasses. They spring in one-by-one during Beat 4
 * (scroll ~0.55→0.78) and settle into a tablescape around the pitcher.
 */
export function Glasses({ progressRef }: { progressRef: RefObject<number> }) {
  const cups = useRef<(THREE.Group | null)[]>([]);
  const glassGeo = useMemo(() => new THREE.LatheGeometry(GLASS_PROFILE, 48), []);

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    // Beat 4 window → 0..1 reveal.
    const reveal = clamp((p - 0.55) / 0.23, 0, 1);
    const t = state.clock.elapsedTime;

    cups.current.forEach((cup, i) => {
      if (!cup) return;
      const local = clamp(reveal * 1.35 - i * 0.16, 0, 1);
      const s = local <= 0 ? 0 : easeOutBack(local) * 0.9;
      cup.scale.setScalar(Math.max(0, s));
      cup.visible = local > 0.001;

      const seat = SEATS[i];
      cup.position.set(
        Math.cos(seat.angle) * seat.radius,
        // drop in from a little above, then settle + a soft idle bob
        0.02 + (1 - local) * 0.6 + Math.sin(t * 1.1 + i) * 0.02 * local,
        Math.sin(seat.angle) * seat.radius
      );
      cup.rotation.y = t * 0.15 + i;
    });
  });

  return (
    <group>
      {SEATS.map((_, i) => (
        <group key={i} ref={(el) => { cups.current[i] = el; }} visible={false}>
          <mesh geometry={glassGeo}>
            <meshStandardMaterial color={palette.cream} roughness={0.4} metalness={0.03} />
          </mesh>
          <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.25, 0.016, 12, 40]} />
            <meshStandardMaterial color={palette.cobalt} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
