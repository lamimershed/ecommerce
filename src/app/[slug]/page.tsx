import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getProductSlugs,
  getProducts,
  getTemplateForProduct,
  site,
} from "@/lib/config";
import { buildProductMetadata } from "@/lib/metadata";
import { ProductTemplate } from "@/components/templates/product-template";
import { ArtisanProduct } from "@/components/templates/artisan-product";
import { ProductGrid } from "@/components/templates/product-grid";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

interface PageProps {
  params: { slug: string };
}

/** Pre-render a static page for every product slug at build time. */
export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return buildProductMetadata(product);
}

export default function ProductPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const template = getTemplateForProduct(product);
  const immersive = template.product.media === "scroll3d";
  const related = getProducts().filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd product={product} />
      {immersive ? (
        <ArtisanProduct
          product={product}
          phone={site.whatsapp}
          productUrl={`${site.url}/${product.slug}`}
        />
      ) : (
        <ProductTemplate product={product} />
      )}
      {related.length > 0 && (
        <div className="border-t border-border/60">
          <ProductGrid
            products={related}
            id="related"
            eyebrow="You may also like"
            title="Related pieces"
            description="More from the collection, hand-picked to pair with this one."
          />
        </div>
      )}
    </>
  );
}
