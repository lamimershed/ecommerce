import { getProducts } from "@/lib/config";
import { HomeHero } from "@/components/templates/home-hero";
import { ProductGrid } from "@/components/templates/product-grid";

/** Root route is the storefront home page. Metadata comes from the JSON-driven
 *  site defaults in the root layout. */
export default function HomePage() {
  const products = getProducts();
  const featured = products[0];

  return (
    <>
      <HomeHero featured={featured} />
      <ProductGrid products={products} />

      <section id="about" className="scroll-mt-20 border-t border-border">
        <div className="container grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-4">
            <span className="label">Our standard</span>
          </div>
          <div className="md:col-span-8">
            <h2 className="display max-w-[18ch] text-balance text-3xl leading-[1.05] md:text-5xl">
              We keep the catalogue small so every piece can be considered.
            </h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3">
              {[
                { k: "10 yr", v: "Average warranty across the catalogue" },
                { k: "Carbon-aware", v: "Shipped flat, made on demand" },
                { k: "30 days", v: "Free returns, no questions asked" },
              ].map((stat) => (
                <div key={stat.k} className="bg-card p-6">
                  <p className="font-display text-3xl tracking-tight">{stat.k}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {stat.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
