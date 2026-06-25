export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  color: string;
  model: "torus" | "sphere" | "box";
  image: string;
  gallery: string[];
  specs: Record<string, string>;
  highlights: string[];
}

export interface ThemeTokens {
  [key: string]: string;
}

export interface Theme {
  label: string;
  mode: "light" | "dark";
  tokens: ThemeTokens;
}

export interface TemplateSection {
  hero?: string;
  media?: string;
  layout: string;
  columns?: number;
  showSpecs?: boolean;
}

export interface Template {
  label: string;
  description: string;
  home: TemplateSection;
  product: TemplateSection;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  currency: string;
  activeTheme: string;
  activeTemplate: string;
  social: { twitter: string; instagram: string };
  nav: { label: string; href: string }[];
}
