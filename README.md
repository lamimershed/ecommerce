# Lumina Store — SEO-friendly Next.js e-commerce

A fast, SEO-first storefront built with **Next.js (App Router)**, **Tailwind CSS**,
**shadcn/ui**-style components, and **React Three Fiber** for interactive 3D product
media. Themes and page templates are configured entirely from local JSON — change
the whole look of the store without touching a single component.

## Highlights

- **Root is the home page** (`/`) and **every product lives at its own slug**
  (`/[slug]`, e.g. `/aurora-desk-lamp`). Product pages are statically generated.
- **SEO baked in**: per-page metadata, canonical URLs, Open Graph + Twitter cards,
  `sitemap.xml`, `robots.txt`, and JSON-LD structured data (`Organization`,
  `WebSite`, `Product`, `BreadcrumbList`).
- **Multiple themes** (`midnight`, `sunrise`, `forest`) and **multiple templates**
  (`aurora`, `editorial`, `boutique`), both selected from JSON.
- **React Three Fiber** hero + product media with a graceful loading fallback.

## Configure from JSON

All store config lives in `src/data/`:

| File             | Purpose                                                        |
| ---------------- | ------------------------------------------------------------- |
| `site.json`      | Store info + the **active theme** and **active template**     |
| `themes.json`    | Theme definitions (CSS custom-property tokens)                |
| `templates.json` | Template definitions (home hero/layout, product media/layout) |
| `products.json`  | The catalog (slug, price, specs, 3D model, gallery, …)        |

To restyle the entire store, edit `activeTheme` / `activeTemplate` in
`src/data/site.json`:

```json
{
  "activeTheme": "sunrise",
  "activeTemplate": "editorial"
}
```

### Templates control layout

Each template (`templates.json`) drives layout decisions:

- `home.hero`: `scene3d` (R3F canvas) or `minimal` (image hero)
- `home.layout` / `home.columns`: grid vs masonry, column count
- `product.media`: `scene3d` (3D) or `gallery` (image carousel)
- `product.layout`: `split` or `stacked`
- `product.showSpecs`: toggle the spec table

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (static product pages)
npm start
```

## Project structure

```
src/
  app/
    layout.tsx          # applies active theme tokens, global SEO + JSON-LD
    page.tsx            # home page (root)
    [slug]/page.tsx     # product page (slug = product name)
    sitemap.ts          # /sitemap.xml
    robots.ts           # /robots.txt
  components/
    templates/          # template-driven hero, grid, product detail
    three/              # React Three Fiber scene (lazy, client-only)
    store/ ui/ seo/     # product cards, shadcn-style primitives, JSON-LD
  data/                 # site / themes / templates / products JSON
  lib/                  # config loaders, types, utils
```
