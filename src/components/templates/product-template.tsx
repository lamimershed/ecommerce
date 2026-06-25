import Link from "next/link";
import { Check, ChevronLeft, ShoppingBag } from "lucide-react";
import { getActiveTemplate } from "@/lib/config";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Rating } from "@/components/store/rating";
import { ProductGallery } from "@/components/templates/product-gallery";
import Scene from "@/components/three/scene";

/**
 * Product detail page driven by the active template's `product` config:
 *  - media:  `scene3d` renders an interactive R3F canvas, `gallery` a carousel
 *  - layout: `split` (two columns) or `stacked` (single column)
 *  - showSpecs: toggles the spec table
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
        className="h-[360px] w-full rounded-2xl border border-border bg-card md:h-[520px]"
      />
    ) : (
      <ProductGallery product={product} />
    );

  return (
    <article className="container py-10 md:py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to collection
      </Link>

      <div
        className={cn(
          "gap-10",
          stacked ? "mx-auto flex max-w-3xl flex-col" : "grid md:grid-cols-2"
        )}
      >
        <div>{Media}</div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Badge variant="accent">{product.category}</Badge>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {product.name}
            </h1>
            <p className="text-lg text-muted-foreground">{product.tagline}</p>
            <Rating value={product.rating} reviews={product.reviews} />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-semibold">
              {formatPrice(product.price, product.currency)}
            </span>
            <Badge variant={product.inStock ? "default" : "secondary"}>
              {product.inStock ? "In stock" : "Sold out"}
            </Badge>
          </div>

          <p className="leading-relaxed text-foreground/90">{product.description}</p>

          <ul className="space-y-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" disabled={!product.inStock}>
              <ShoppingBag className="h-4 w-4" />
              {product.inStock ? "Add to bag" : "Notify me"}
            </Button>
            <Button size="lg" variant="outline">
              Add to wishlist
            </Button>
          </div>

          {showSpecs && (
            <Card className="mt-4">
              <CardContent className="p-0">
                <dl className="divide-y divide-border">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between px-5 py-3 text-sm"
                    >
                      <dt className="text-muted-foreground">{key}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </article>
  );
}
