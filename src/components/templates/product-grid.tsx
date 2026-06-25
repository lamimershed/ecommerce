import { getActiveTemplate } from "@/lib/config";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/store/product-card";
import { cn } from "@/lib/utils";

const columnClass: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

interface ProductGridProps {
  products: Product[];
  eyebrow?: string;
  title?: string;
  description?: string;
  id?: string;
}

/**
 * Catalog grid whose column count and rhythm come from the active template's
 * `home.layout` / `home.columns` config in local JSON.
 */
export function ProductGrid({
  products,
  eyebrow = "Collection",
  title = "The full catalogue",
  description,
  id = "collection",
}: ProductGridProps) {
  const template = getActiveTemplate();
  const columns = template.home.columns ?? 3;
  const masonry = template.home.layout === "masonry";

  return (
    <section id={id} className="container scroll-mt-20 py-20 md:py-28">
      <div className="mb-12 flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <span className="label">{eyebrow}</span>
          <h2 className="display text-4xl tracking-tight md:text-5xl">{title}</h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description ?? template.description}
        </p>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-x-6 gap-y-12",
          columnClass[columns] ?? columnClass[3],
          masonry && "md:[&>*:nth-child(even)]:mt-12"
        )}
      >
        {products.map((product, i) => (
          <ProductCard key={product.slug} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
