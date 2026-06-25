import type { MetadataRoute } from "next";
import { getProducts, site } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const products = getProducts().map((product) => ({
    url: `${site.url}/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...products,
  ];
}
