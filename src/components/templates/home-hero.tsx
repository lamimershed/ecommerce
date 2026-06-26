import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { site, getActiveTemplate } from "@/lib/config";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import Scene from "@/components/three/scene";
import ArtisanScene from "@/components/three/artisan-scene";

/**
 * Home hero whose media is selected by the active template's `home.hero`
 * value (`scene3d` | `minimal`), read from local JSON config.
 */
export function HomeHero({ featured }: { featured: Product }) {
  const template = getActiveTemplate();
  const variant = template.home.hero;
  const { eyebrow, headline, subhead } = site.hero;

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-hairlines opacity-[0.35]" />

      <div className="container relative grid gap-12 py-14 md:grid-cols-12 md:py-20">
        {/* Left: editorial copy */}
        <div className="flex flex-col justify-between gap-10 md:col-span-7">
          <div className="flex items-center justify-between">
            <span className="label">{eyebrow}</span>
            <span className="label hidden sm:inline">{`${"—"} ${new Date().getFullYear()}`}</span>
          </div>

          <h1 className="display max-w-[14ch] text-balance text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
            {headline}
          </h1>

          <div className="flex flex-col gap-8">
            <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
              {subhead}
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="#collection"
                className="group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-background transition-transform hover:-translate-y-0.5"
              >
                Browse the index
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </Link>
              <Link
                href={`/${featured.slug}`}
                className="link-underline font-mono text-xs uppercase tracking-[0.16em] text-foreground"
              >
                Featured: {featured.name}
              </Link>
            </div>
          </div>
        </div>

        {/* Right: 3D / image media */}
        <div className="relative md:col-span-5">
          <div
            className={cn(
              "relative h-[340px] overflow-hidden rounded-sm border border-border md:h-full md:min-h-[460px]",
              featured.model === "surahi"
                ? "bg-[radial-gradient(95%_90%_at_50%_15%,hsl(var(--primary)/0.18),hsl(var(--secondary)))]"
                : "bg-card"
            )}
          >
            {featured.model === "surahi" ? (
              <ArtisanScene color={featured.color} className="h-full w-full" />
            ) : variant === "scene3d" ? (
              <Scene
                model={featured.model}
                color={featured.color}
                className="h-full w-full"
              />
            ) : (
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${featured.image})` }}
              />
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
              <div>
                <p className="label">Now showing</p>
                <p className="font-display text-lg">{featured.name}</p>
              </div>
              <p className="font-mono text-sm">{formatPrice(featured.price, featured.currency)}</p>
            </div>
          </div>
          <span className="label absolute -top-3 right-0 hidden md:block">
            {variant === "scene3d" ? "drag to rotate" : "featured"}
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
