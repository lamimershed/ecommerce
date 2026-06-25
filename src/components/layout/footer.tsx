import Link from "next/link";
import { site } from "@/lib/config";

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="label">{site.tagline}</p>
            <p className="mt-4 max-w-sm text-pretty text-lg leading-relaxed text-muted-foreground">
              {site.description}
            </p>
          </div>

          <nav className="flex flex-col gap-3 md:col-span-3 md:col-start-8">
            <span className="label mb-1">Explore</span>
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-underline w-fit text-sm"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/sitemap.xml" className="link-underline w-fit text-sm">
              Sitemap
            </Link>
          </nav>

          <nav className="flex flex-col gap-3 md:col-span-2">
            <span className="label mb-1">Social</span>
            <a
              href={`https://twitter.com/${site.social.twitter.replace("@", "")}`}
              className="link-underline w-fit text-sm"
            >
              Twitter
            </a>
            <a
              href={`https://instagram.com/${site.social.instagram}`}
              className="link-underline w-fit text-sm"
            >
              Instagram
            </a>
          </nav>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div className="overflow-hidden border-t border-border">
        <p className="display select-none whitespace-nowrap px-6 py-8 text-center text-[18vw] leading-none tracking-tightest text-foreground/[0.06] md:text-[14vw]">
          {site.name}
        </p>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label">
            © {new Date().getFullYear()} {site.name} — All rights reserved
          </p>
          <p className="label">Next.js · Tailwind · shadcn/ui · React Three Fiber</p>
        </div>
      </div>
    </footer>
  );
}
