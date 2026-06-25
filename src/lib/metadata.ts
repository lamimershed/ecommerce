import type { Metadata } from "next";
import { site } from "@/lib/config";
import type { Product } from "@/lib/types";

/** Site-wide metadata, entirely from site.json → seo. */
export function buildSiteMetadata(): Metadata {
  const { seo } = site;
  return {
    metadataBase: new URL(site.url),
    title: { default: seo.defaultTitle, template: seo.titleTemplate },
    description: seo.description,
    keywords: seo.keywords,
    applicationName: site.name,
    authors: [{ name: site.name }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: site.locale,
      url: site.url,
      siteName: site.name,
      title: seo.defaultTitle,
      description: seo.description,
      images: [{ url: seo.ogImage, width: 1200, height: 900, alt: seo.defaultTitle }],
    },
    twitter: {
      card: seo.twitterCard,
      site: site.social.twitter,
      title: seo.defaultTitle,
      description: seo.description,
      images: [seo.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

/** Per-product metadata, from product.seo with sensible JSON-backed fallbacks. */
export function buildProductMetadata(product: Product): Metadata {
  const seo = product.seo ?? {};
  const title = seo.title ?? product.name;
  const description = seo.description ?? product.tagline;
  const ogTitle = seo.ogTitle ?? title;
  const ogDescription = seo.ogDescription ?? description;
  const ogImage = seo.ogImage ?? product.image;
  const keywords = seo.keywords ?? site.seo.keywords;
  const url = `${site.url}/${product.slug}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/${product.slug}` },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: ogTitle,
      description: ogDescription,
      images: [{ url: ogImage, width: 1200, height: 900, alt: ogTitle }],
    },
    twitter: {
      card: site.seo.twitterCard,
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}
