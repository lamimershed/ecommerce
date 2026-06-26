"use client";

import dynamic from "next/dynamic";
import type { RefObject } from "react";
import { SceneBoundary } from "@/components/three/scene-fallback";

const SurahiScene = dynamic(() => import("@/components/three/surahi-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-28 w-28 animate-pulse rounded-full bg-primary/10" />
    </div>
  ),
});

export default function ArtisanScene({
  sectionRef,
  color,
  className,
}: {
  sectionRef?: RefObject<HTMLElement>;
  color?: string;
  className?: string;
}) {
  return (
    <SceneBoundary color={color}>
      <SurahiScene sectionRef={sectionRef} className={className} />
    </SceneBoundary>
  );
}
