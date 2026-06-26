import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { site } from "@/lib/config";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import ArtisanScene from "@/components/three/artisan-scene";
import { WhatsAppButton } from "@/components/store/whatsapp-button";
import { FolkDots } from "@/components/store/folk-dots";

/**
 * Home hero: editorial copy beside the magical 3D surahi, on a cool plaster-wall
 * backdrop that echoes the product photography.
 */
export function HomeHero({ featured }: { featured: Product }) {
  const { eyebrow, headline, subhead } = site.hero;
  const productUrl = `${site.url}/${featured.slug}`;

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-hairlines opacity-[0.3]" />

      <div className="container relative grid gap-12 py-14 md:grid-cols-12 md:py-20">
        {/* Left: editorial copy */}
        <div className="flex flex-col justify-between gap-10 md:col-span-7">
          <div className="flex items-center justify-between">
            <span className="label">{eyebrow}</span>
            <span className="label hidden sm:inline">{`— ${new Date().getFullYear()}`}</span>
          </div>

          <div>
            <h1 className="display max-w-[14ch] text-balance text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              {headline}
            </h1>
            <FolkDots className="mt-6" />
          </div>

          <div className="flex flex-col gap-8">
            <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
              {subhead}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="#set"
                className="group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-background transition-transform hover:-translate-y-0.5"
              >
                See the set
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </Link>
              <WhatsAppButton
                phone={site.whatsapp}
                productName={featured.name}
                productUrl={productUrl}
                label="Order on WhatsApp"
                className="px-6 py-3"
              />
            </div>
          </div>
        </div>

        {/* Right: magical 3D on a plaster-wall backdrop */}
        <div className="relative md:col-span-5">
          <div className="surface-wall relative h-[360px] overflow-hidden rounded-sm border border-border md:h-full md:min-h-[480px]">
            <ArtisanScene color={featured.color} className="h-full w-full" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
              <div>
                <p className="label">Now showing</p>
                <p className="font-display text-lg leading-tight">{featured.name}</p>
              </div>
              <p className="font-mono text-sm">{formatPrice(featured.price, featured.currency)}</p>
            </div>
          </div>
          <span className="label absolute -top-3 right-0 hidden md:block">
            drag to rotate
          </span>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="border-t border-border py-3">
        <div className="mask-fade-r flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
            {[...site.marquee, ...site.marquee].map((word, i) => (
              <span key={i} className="flex items-center gap-10">
                <span className="label whitespace-nowrap">{word}</span>
                <span className="h-1 w-1 rounded-full bg-accent" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
