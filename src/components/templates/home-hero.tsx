import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site, getActiveTemplate } from "@/lib/config";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Scene from "@/components/three/scene";

/**
 * Home hero whose layout is selected by the active template's `home.hero`
 * value (`scene3d` | `minimal`), read from local JSON config.
 */
export function HomeHero({ featured }: { featured: Product }) {
  const template = getActiveTemplate();
  const variant = template.home.hero;

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_0%,hsl(var(--primary)/0.18),transparent)]" />
      <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="animate-fade-up space-y-6">
          <Badge variant="accent">{site.tagline}</Badge>
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            {site.name}
          </h1>
          <p className="max-w-md text-pretty text-lg text-muted-foreground">
            {site.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="#collection">
                Shop the collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={`/${featured.slug}`}>View {featured.name}</Link>
            </Button>
          </div>
        </div>

        <div className="relative h-[320px] md:h-[440px]">
          {variant === "scene3d" ? (
            <Scene
              model={featured.model}
              color={featured.color}
              className="h-full w-full"
            />
          ) : (
            <div
              className="flex h-full w-full items-end overflow-hidden rounded-2xl border border-border bg-cover bg-center p-6"
              style={{ backgroundImage: `url(${featured.image})` }}
            >
              <div className="rounded-xl bg-background/80 p-4 backdrop-blur">
                <p className="text-sm text-muted-foreground">Featured</p>
                <p className="text-lg font-semibold">{featured.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
