"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { SceneBoundary } from "@/components/three/scene-fallback";
import { ScrollStory } from "@/components/product/scroll-story";
import { PurchaseModule } from "@/components/product/purchase-module";
import { StickyBar } from "@/components/product/sticky-bar";
import { CrossSell } from "@/components/product/cross-sell";
import { StaticStory } from "@/components/product/static-story";

// The WebGL scene is client-only and lazy — keeps it out of SSR/first paint.
const Experience = dynamic(
  () => import("@/components/product/experience").then((m) => m.Experience),
  { ssr: false }
);

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

interface Props {
  product: Product;
  phone: string;
  productUrl: string;
}

export function ArtisanExperience({ product, phone, productUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"motion" | "static">("motion");
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !hasWebGL()) setMode("static");

    const mq = window.matchMedia("(max-width: 767px)");
    setMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (mode === "static") {
    return (
      <>
        <StaticStory product={product} phone={phone} productUrl={productUrl} />
        <PurchaseModule product={product} phone={phone} productUrl={productUrl} />
        <CrossSell />
        <StickyBar product={product} phone={phone} productUrl={productUrl} />
      </>
    );
  }

  return (
    <>
      <div ref={containerRef} className="relative">
        {/* Pinned 3D stage on a plaster-wall backdrop */}
        <div className="surface-wall pointer-events-none sticky top-0 h-[100svh] overflow-hidden">
          <SceneBoundary color={product.color}>
            <Experience containerRef={containerRef} mobile={mobile} />
          </SceneBoundary>
          {/* Static fallback image sits under the canvas until/if it fails to load */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30">
            <Image
              src={product.image}
              alt=""
              width={360}
              height={360}
              className="rounded-full object-cover blur-2xl"
            />
          </div>
        </div>

        {/* DOM story beats + conversion, layered over the pinned stage */}
        <div className="relative -mt-[100svh]">
          <ScrollStory product={product} phone={phone} productUrl={productUrl} />
          <PurchaseModule product={product} phone={phone} productUrl={productUrl} />
        </div>
      </div>

      <CrossSell />
      <StickyBar product={product} phone={phone} productUrl={productUrl} />
    </>
  );
}
