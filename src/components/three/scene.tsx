"use client";

import dynamic from "next/dynamic";
import type { ProductSceneProps } from "@/components/three/product-scene";
import { SceneBoundary } from "@/components/three/scene-fallback";

/**
 * Client-side wrapper that lazy-loads the WebGL canvas. Keeping the 3D bundle
 * out of SSR keeps pages fast and crawlable while still giving an interactive
 * hero on the client.
 */
const ProductScene = dynamic(() => import("@/components/three/product-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-24 w-24 animate-pulse rounded-full bg-primary/20" />
    </div>
  ),
});

export default function Scene(props: ProductSceneProps) {
  return (
    <SceneBoundary color={props.color}>
      <ProductScene {...props} />
    </SceneBoundary>
  );
}
