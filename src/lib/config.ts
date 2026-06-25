import siteData from "@/data/site.json";
import themesData from "@/data/themes.json";
import templatesData from "@/data/templates.json";
import productsData from "@/data/products.json";
import type { Product, SiteConfig, Theme, Template } from "@/lib/types";

const themes = themesData as unknown as Record<string, Theme>;
const templates = templatesData as unknown as Record<string, Template>;

/** Single source of truth for store-wide configuration, loaded from local JSON. */
export const site = siteData as unknown as SiteConfig;

/** Resolve the active theme, falling back to the first defined theme. */
export function getActiveTheme(): Theme {
  return themes[site.activeTheme] ?? Object.values(themes)[0];
}

/** Resolve the active template, falling back to the first defined template. */
export function getActiveTemplate(): Template {
  return templates[site.activeTemplate] ?? Object.values(templates)[0];
}

export function getThemes(): Record<string, Theme> {
  return themes;
}

export function getTemplates(): Record<string, Template> {
  return templates;
}

/** Turn a theme's token map into an inline CSS-variable style object. */
export function themeStyle(theme: Theme): Record<string, string> {
  return theme.tokens as Record<string, string>;
}

export function getProducts(): Product[] {
  return productsData as unknown as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getProductSlugs(): string[] {
  return getProducts().map((p) => p.slug);
}
