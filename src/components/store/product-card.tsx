import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({
  product,
  index,
}: {
  product: Product;
  index?: number;
}) {
  return (
    <Link href={`/${product.slug}`} className="group block">
      <article className="flex h-full flex-col">
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border bg-muted"
          style={{
            backgroundImage: `radial-gradient(120% 90% at 30% 10%, ${product.color}22, transparent 60%)`,
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />

          {/* top meta */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <span className="rounded-full bg-background/85 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] backdrop-blur">
              {product.category}
            </span>
            {!product.inStock && (
              <span className="rounded-full bg-foreground px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-background">
                Sold out
              </span>
            )}
          </div>

          {/* hover CTA */}
          <div className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 pt-4">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-xl leading-tight tracking-tight">
              {product.name}
            </h3>
            {index != null && (
              <span className="label shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.tagline}
          </p>
          <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
            <span className="font-mono text-sm">
              {formatPrice(product.price, product.currency)}
            </span>
            <span className="label">
              ★ {product.rating.toFixed(1)} · {product.reviews}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
