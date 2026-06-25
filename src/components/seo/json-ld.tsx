import { site } from "@/lib/config";
import type { Product } from "@/lib/types";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: site.name,
        url: site.url,
        description: site.description,
        sameAs: [
          `https://twitter.com/${site.social.twitter.replace("@", "")}`,
          `https://instagram.com/${site.social.instagram}`,
        ],
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: site.name,
        url: site.url,
        potentialAction: {
          "@type": "SearchAction",
          target: `${site.url}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: [product.image, ...product.gallery],
        category: product.category,
        sku: product.slug,
        brand: { "@type": "Brand", name: site.name },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviews,
        },
        offers: {
          "@type": "Offer",
          url: `${site.url}/${product.slug}`,
          priceCurrency: product.currency,
          price: product.price,
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({ product }: { product: Product }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: product.name,
            item: `${site.url}/${product.slug}`,
          },
        ],
      }}
    />
  );
}
