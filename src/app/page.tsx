import type { Metadata } from "next";
import { getProducts, site } from "@/lib/config";
import { HomeHero } from "@/components/templates/home-hero";
import { ProductGrid } from "@/components/templates/product-grid";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

/** Root route is the storefront home page. */
export default function HomePage() {
  const products = getProducts();
  const featured = products[0];

  return (
    <>
      <HomeHero featured={featured} />
      <ProductGrid products={products} />

      <section id="about" className="container scroll-mt-20 pb-24">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-14">
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">
            Engineered for speed, crafted for search.
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Every page is statically generated, fully responsive, and ships
            structured data so search engines understand your catalog. Themes and
            templates are configured from a single local JSON file — swap the look
            of the whole store without touching a component.
          </p>
        </div>
      </section>
    </>
  );
}
