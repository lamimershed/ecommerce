"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { HutIcon } from "@/components/motifs/hut-icon";
import { DotsCluster } from "@/components/motifs/dots-cluster";
import { WhatsAppButton } from "@/components/store/whatsapp-button";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.5 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

/**
 * The DOM story layer that scrolls over the pinned 3D canvas. All copy is real
 * DOM (SEO + a11y). Five beats mirror the camera choreography in <Experience>.
 */
export function ScrollStory({
  product,
  phone,
  productUrl,
}: {
  product: Product;
  phone: string;
  productUrl: string;
}) {
  const story = product.story ?? [];

  return (
    <div>
      {/* BEAT 1 — HERO */}
      <section className="relative flex min-h-[100svh] items-center">
        <div className="container">
          <div className="max-w-xl rounded-xl bg-background/55 p-6 backdrop-blur-sm sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
            <span className="label">Handmade in Khurja, India</span>
            <h1 className="display mt-4 text-balance text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              A village morning, poured into ceramic
            </h1>
            <p className="mt-4 font-hand text-2xl text-accent sm:text-3xl">
              hand-painted in Khurja — no two alike
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <span className="font-mono text-2xl">
                {formatPrice(product.price, product.currency)}
              </span>
              <WhatsAppButton
                phone={phone}
                productName={product.name}
                productUrl={productUrl}
                label="Order on WhatsApp"
                className="px-6 py-3"
              />
            </div>
            <div className="mt-12 flex items-center gap-2 text-muted-foreground">
              <ChevronDown className="h-4 w-4 animate-bounce" />
              <span className="font-hand text-lg">scroll to unfold the story</span>
            </div>
          </div>
        </div>
      </section>

      {/* BEAT 2 — THE VILLAGE STORY */}
      <section className="relative min-h-[115svh]">
        <div className="sticky top-0 flex h-[100svh] items-center">
          <div className="container">
            {story.slice(0, 2).map((s, i) => (
              <motion.div
                key={s.title}
                {...fadeUp}
                className={`max-w-md rounded-lg border border-border bg-background/80 p-7 backdrop-blur-md ${
                  i === 1 ? "ml-auto mt-6 text-right" : ""
                }`}
              >
                <div className={`flex items-center gap-3 ${i === 1 ? "justify-end" : ""}`}>
                  <HutIcon size={34} />
                  <span className="label">
                    {String(i + 1).padStart(2, "0")} / {String(story.length).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="display mt-3 text-3xl leading-tight sm:text-4xl">{s.title}</h2>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{s.body}</p>
                <DotsCluster className={`mt-5 h-6 w-40 ${i === 1 ? "ml-auto" : ""}`} seed={i + 3} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BEAT 3 — MADE BY HAND */}
      <section className="relative min-h-[125svh]">
        <div className="sticky top-0 flex h-[100svh] items-center">
          <div className="container">
            <motion.div
              {...fadeUp}
              className="max-w-lg rounded-lg border border-border bg-background/85 p-7 backdrop-blur-md"
            >
              <span className="label">Made by hand</span>
              <h2 className="display mt-3 text-3xl leading-tight sm:text-4xl">
                Painted dot by dot, in the ceramic heartland of India
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Every surahi is thrown, glazed with a food-safe finish and painted
                entirely by hand in Khurja, Uttar Pradesh — carrying generations of
                craft in every brushstroke.
              </p>

              {/* TODO: replace with real macro photos / a short muted video of an
                  artisan painting the dots. Using product photos as placeholders. */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[product.image, ...product.gallery].slice(0, 3).map((src) => (
                  <div key={src} className="relative aspect-square overflow-hidden rounded-md border border-border">
                    <Image src={src} alt="Artisan detail" fill sizes="120px" className="object-cover" />
                  </div>
                ))}
              </div>

              {/* "No two are alike" compare */}
              <div className="mt-6">
                <p className="font-hand text-xl text-accent">spot the difference — no two are alike →</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {product.gallery.slice(0, 2).map((src) => (
                    <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-md border border-border">
                      {/* TODO: swap for tight macro crops of the same motif on two pieces */}
                      <Image src={src} alt="Hand-painted variation" fill sizes="200px" className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BEAT 4 — THE FULL SET (spec callouts) */}
      <section className="relative min-h-[125svh]">
        <div className="sticky top-0 flex h-[100svh] items-center">
          <div className="container">
            <motion.div
              {...fadeUp}
              className="ml-auto max-w-sm rounded-lg border border-border bg-background/85 p-7 backdrop-blur-md"
            >
              <span className="label">The full set</span>
              <h2 className="display mt-3 text-3xl leading-tight sm:text-4xl">
                One pitcher, four glasses
              </h2>
              <dl className="mt-5 space-y-3">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="flex items-baseline gap-3 border-b border-dashed border-border pb-2">
                    <dt className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">{k}</dt>
                    <span className="flex-1 border-b border-dotted border-border" />
                    <dd className="text-right text-sm font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 font-hand text-lg text-muted-foreground">
                the surahi stands ~28&nbsp;cm — about a wine bottle tall
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
