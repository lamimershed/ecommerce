"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import ArtisanScene from "@/components/three/artisan-scene";
import { ProductGallery } from "@/components/templates/product-gallery";
import { WhatsAppButton } from "@/components/store/whatsapp-button";

interface Props {
  product: Product;
  phone: string;
  productUrl: string;
}

/**
 * Immersive, mobile-first scrollytelling template. A sticky 3D canvas stays
 * pinned while the product story scrolls over it and the model animates with
 * scroll progress. Ends with a WhatsApp order CTA.
 */
export function ArtisanProduct({ product, phone, productUrl }: Props) {
  const storyRef = useRef<HTMLElement>(null);
  const story = product.story ?? [];

  return (
    <article>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Link
            href="/"
            className="link-underline inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Index
          </Link>
          <span className="label">{product.category}</span>
        </div>
      </div>

      {/* Scrollytelling hero — sticky 3D with story panels over it */}
      <section
        ref={storyRef}
        className="relative bg-[radial-gradient(120%_80%_at_50%_0%,hsl(var(--secondary)),hsl(var(--background)))]"
      >
        <div className="pointer-events-none sticky top-0 h-[100svh] w-full">
          <ArtisanScene
            sectionRef={storyRef}
            color={product.color}
            className="h-full w-full"
          />
        </div>

        <div className="relative -mt-[100svh]">
          {/* Intro panel */}
          <div className="container flex h-[100svh] flex-col justify-center">
            <span className="label animate-fade-up">{product.category} · Handmade in India</span>
            <h1 className="display mt-4 max-w-[16ch] text-balance text-4xl leading-[0.95] sm:text-6xl lg:text-7xl">
              {product.name}
            </h1>
            {/* Hand-painted folk dots */}
            <div className="mt-5 flex gap-1.5" aria-hidden>
              {["#cf3b2e", "#e8b53a", "#3f8fd0", "#5a9b54", "#1f3f97"].map((c) => (
                <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {product.tagline}
            </p>
            <div className="mt-10 flex items-center gap-2 text-muted-foreground">
              <ChevronDown className="h-4 w-4 animate-bounce" />
              <span className="label">Scroll to unfold the story</span>
            </div>
          </div>

          {/* Story panels */}
          {story.map((s, i) => (
            <div
              key={s.title}
              className={cn(
                "container flex h-[100svh] flex-col justify-center",
                i % 2 === 1 && "items-end text-right"
              )}
            >
              <div className="max-w-md rounded-sm border border-border bg-background/70 p-7 backdrop-blur-md sm:p-9">
                <span className="label">{String(i + 1).padStart(2, "0")} / {String(story.length).padStart(2, "0")}</span>
                <h2 className="display mt-3 text-3xl leading-tight sm:text-4xl">
                  {s.title}
                </h2>
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Details */}
      <section className="border-t border-border">
        <div className="container grid gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ProductGallery product={product} />
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-5 border-b border-border pb-5">
              <span className="font-mono text-2xl">
                {formatPrice(product.price, product.currency)}
              </span>
              <span className="label">
                ★ {product.rating.toFixed(1)} · {product.reviews} reviews
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em]">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {product.inStock ? "In stock" : "Made to order"}
              </span>
            </div>

            <p className="max-w-prose text-pretty leading-relaxed text-foreground/90">
              {product.description}
            </p>

            <ul className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 bg-card p-4 text-sm leading-relaxed">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div>
              <p className="label mb-3">Specification</p>
              <dl className="divide-y divide-border border-y border-border">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      {key}
                    </dt>
                    <dd className="text-right text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <WhatsAppButton
              phone={phone}
              productName={product.name}
              productUrl={productUrl}
              className="w-full sm:w-fit"
            />
          </div>
        </div>
      </section>

      {/* Final WhatsApp CTA */}
      <section className="relative overflow-hidden border-t border-border bg-secondary/40">
        <div className="pointer-events-none absolute inset-0 bg-dots-accent opacity-60" />
        <div className="container relative flex flex-col items-center gap-6 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Handmade · Hand-painted · One of a kind
          </span>
          <h2 className="display max-w-[18ch] text-balance text-3xl leading-[1.05] md:text-5xl">
            Bring a little village morning into your home.
          </h2>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            Tap below to message us on WhatsApp — your chat opens pre-filled with
            this set and its link, ready to send.
          </p>
          <WhatsAppButton
            phone={phone}
            productName={product.name}
            productUrl={productUrl}
            label="Message us to order"
            className="mt-2"
          />
          <span className="label">{`+${phone.slice(0, 2)} ${phone.slice(2)}`}</span>
        </div>
      </section>
    </article>
  );
}
