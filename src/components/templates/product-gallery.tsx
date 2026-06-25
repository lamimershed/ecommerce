"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: Product }) {
  const images = [product.image, ...product.gallery];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-sm border border-border bg-muted">
        <Image
          src={images[active]}
          alt={`${product.name} view ${active + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${product.name} view ${i + 1}`}
            className={cn(
              "relative aspect-square overflow-hidden rounded-sm border bg-muted transition-all",
              active === i ? "border-foreground ring-1 ring-foreground" : "border-border opacity-70 hover:opacity-100"
            )}
          >
            <Image src={src} alt="" fill sizes="120px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
