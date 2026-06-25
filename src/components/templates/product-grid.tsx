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
  title = "Everything in the catalog",
  description,
  id = "collection",
}: ProductGridProps) {
  const template = getActiveTemplate();
  const columns = template.home.columns ?? 3;
  const masonry = template.home.layout === "masonry";

  return (
    <section id={id} className="container scroll-mt-20 py-16 md:py-24">
      <div className="mb-10 flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="max-w-xl text-muted-foreground">
          {description ?? template.description}
        </p>
      </div>
      <div
        className={cn(
          "grid grid-cols-1 gap-6",
          columnClass[columns] ?? columnClass[3],
          masonry && "md:[&>*:nth-child(even)]:mt-8"
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
