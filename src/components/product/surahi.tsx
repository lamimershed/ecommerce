"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { palette, folkColors } from "@/lib/theme";

/*
 * TODO: swap this primitive model for the real photogrammetry asset once ready:
 *   const { nodes, materials } = useGLTF("/models/surahi-draco.glb");
 * Keep this component's <group> API (position/scale) so the rest of the scene
 * (camera director, glasses) needs no changes. Use a Draco-compressed .glb and
 * drei's <useGLTF> with the draco loader for a 60fps mobile budget.
 */

const v2 = (x: number, y: number) => new THREE.Vector2(x, y);
const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

const SURAHI_PROFILE = [
  v2(0.0, 0.0), v2(0.35, 0.0), v2(0.55, 0.05), v2(0.85, 0.32), v2(1.0, 0.78),
  v2(0.92, 1.2), v2(0.6, 1.55), v2(0.42, 1.78), v2(0.39, 2.0), v2(0.39, 2.85),
  v2(0.42, 3.0), v2(0.36, 3.05), v2(0.0, 3.05),
];
const LID_PROFILE = [
  v2(0.44, 0.0), v2(0.45, 0.07), v2(0.4, 0.12), v2(0.3, 0.3), v2(0.16, 0.44),
  v2(0.07, 0.52), v2(0.06, 0.58), v2(0.11, 0.62), v2(0.05, 0.7), v2(0.0, 0.74),
];
const SPOUT_CURVE = new THREE.CatmullRomCurve3([
  v3(-0.5, 1.5, 0), v3(-0.95, 1.6, 0), v3(-1.18, 1.95, 0), v3(-1.22, 2.3, 0),
]);
const HANDLE_CURVE = new THREE.CatmullRomCurve3([
  v3(0.5, 2.6, 0), v3(0.98, 2.35, 0), v3(1.02, 1.95, 0), v3(0.62, 1.62, 0),
]);

/**
 * Paints a hand-drawn "village" texture in a 2D canvas so the placeholder reads
 * like the real ceramic (cream body, cobalt bands, huts, scattered dots).
 * Swapped out automatically when a real textured .glb is dropped in.
 */
function useSurahiTexture() {
  return useMemo(() => {
    const w = 1024;
    const h = 512;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d")!;

    ctx.fillStyle = palette.cream;
    ctx.fillRect(0, 0, w, h);

    // cobalt bands (top rim + belly)
    ctx.fillStyle = palette.cobalt;
    ctx.fillRect(0, 40, w, 10);
    ctx.fillRect(0, h - 150, w, 14);

    // a repeating row of little huts around the belly
    const huts = 6;
    for (let i = 0; i < huts; i++) {
      const x = (i + 0.5) * (w / huts);
      const y = h - 210;
      const s = 46;
      // wall
      ctx.fillStyle = folkColors[i % folkColors.length];
      ctx.fillRect(x - s / 2, y, s, s * 0.9);
      // roof
      ctx.fillStyle = palette.terracotta;
      ctx.beginPath();
      ctx.moveTo(x - s * 0.62, y);
      ctx.lineTo(x, y - s * 0.55);
      ctx.lineTo(x + s * 0.62, y);
      ctx.closePath();
      ctx.fill();
      // door
      ctx.fillStyle = palette.cobalt;
      ctx.fillRect(x - s * 0.12, y + s * 0.4, s * 0.24, s * 0.5);
    }

    // scattered polka dots everywhere (deterministic)
    let seed = 11;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = folkColors[i % folkColors.length];
      ctx.beginPath();
      ctx.arc(rand() * w, rand() * (h - 170), 2 + rand() * 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.set(2, 1);
    tex.anisotropy = 4;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

export function Surahi(props: React.ComponentProps<"group">) {
  const texture = useSurahiTexture();

  const [bodyGeo, lidGeo, spoutGeo, handleGeo] = useMemo(
    () => [
      new THREE.LatheGeometry(SURAHI_PROFILE, 96),
      new THREE.LatheGeometry(LID_PROFILE, 64),
      new THREE.TubeGeometry(SPOUT_CURVE, 48, 0.12, 16, false),
      new THREE.TubeGeometry(HANDLE_CURVE, 48, 0.07, 14, false),
    ],
    []
  );

  return (
    <group {...props}>
      <mesh geometry={bodyGeo}>
        <meshStandardMaterial map={texture} roughness={0.45} metalness={0.03} />
      </mesh>
      <mesh geometry={spoutGeo}>
        <meshStandardMaterial map={texture} roughness={0.45} />
      </mesh>
      <mesh geometry={handleGeo}>
        <meshStandardMaterial map={texture} roughness={0.45} />
      </mesh>
      {/* cobalt lid */}
      <mesh geometry={lidGeo} position={[0, 2.98, 0]}>
        <meshStandardMaterial color={palette.cobalt} roughness={0.3} metalness={0.05} />
      </mesh>
    </group>
  );
}
