import Link from "next/link";
import { site } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="container flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold">{site.name}</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{site.tagline}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
          <Link href="/sitemap.xml" className="hover:text-foreground">
            Sitemap
          </Link>
        </nav>
      </div>
      <div className="border-t border-border/60">
        <div className="container py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site.name}. Built with Next.js, Tailwind, shadcn/ui &amp; React Three Fiber.
        </div>
      </div>
    </footer>
  );
}
