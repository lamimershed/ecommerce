import Link from "next/link";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { getActiveTemplate } from "@/lib/config";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/templates/product-gallery";
import Scene from "@/components/three/scene";

/**
 * Product detail page driven by the active template's `product` config:
 *  - media:  `scene3d` renders an interactive R3F canvas, `gallery` a carousel
 *  - layout: `split` (sticky media + content) or `stacked` (single column)
 *  - showSpecs: toggles the spec ledger
 */
export function ProductTemplate({ product }: { product: Product }) {
  const template = getActiveTemplate();
  const { media, layout, showSpecs } = template.product;
  const stacked = layout === "stacked";

  const Media =
    media === "scene3d" ? (
      <Scene
        model={product.model}
        color={product.color}
        className="h-[380px] w-full rounded-sm border border-border bg-card md:h-[560px]"
      />
    ) : (
      <ProductGallery product={product} />
    );

  return (
    <article>
      {/* Breadcrumb bar */}
      <div className="border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Link
            href="/"
            className="link-underline inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Index
          </Link>
          <span className="label">
            {product.category} / {product.name}
          </span>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        <div
          className={cn(
            "gap-12 lg:gap-20",
            stacked ? "mx-auto flex max-w-3xl flex-col" : "grid lg:grid-cols-2"
          )}
        >
          <div className={cn(!stacked && "lg:sticky lg:top-24 lg:h-fit")}>{Media}</div>

          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-4">
              <span className="label">{product.category}</span>
              <h1 className="display text-balance text-4xl leading-[0.95] md:text-6xl">
                {product.name}
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {product.tagline}
              </p>
            </header>

            <div className="flex items-center gap-5 border-y border-border py-5">
              <span className="font-mono text-2xl">
                {formatPrice(product.price, product.currency)}
              </span>
              <span className="label">
                ★ {product.rating.toFixed(1)} · {product.reviews} reviews
              </span>
              <span
                className={cn(
                  "ml-auto inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em]",
                  product.inStock ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    product.inStock ? "bg-accent" : "bg-muted-foreground"
                  )}
                />
                {product.inStock ? "In stock" : "Sold out"}
              </span>
            </div>

            <p className="max-w-prose text-pretty leading-relaxed text-foreground/90">
              {product.description}
            </p>

            <ul className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2">
              {product.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2.5 bg-card p-4 text-sm leading-relaxed"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                disabled={!product.inStock}
                className="rounded-full font-mono text-xs uppercase tracking-[0.16em]"
              >
                <ShoppingBag className="h-4 w-4" />
                {product.inStock ? "Add to bag" : "Notify me"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full font-mono text-xs uppercase tracking-[0.16em]"
              >
                Save for later
              </Button>
            </div>

            {showSpecs && (
              <div className="mt-2">
                <p className="label mb-3">Specification</p>
                <dl className="divide-y divide-border border-y border-border">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-baseline justify-between gap-6 py-3"
                    >
                      <dt className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        {key}
                      </dt>
                      <dd className="text-right text-sm font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
