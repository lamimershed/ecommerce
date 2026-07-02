import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { HutIcon } from "@/components/motifs/hut-icon";
import { WhatsAppButton } from "@/components/store/whatsapp-button";

/**
 * Static, motion-free rendering used when the visitor prefers reduced motion or
 * WebGL is unavailable. Same copy and photos, no canvas or scroll choreography.
 */
export function StaticStory({
  product,
  phone,
  productUrl,
}: {
  product: Product;
  phone: string;
  productUrl: string;
}) {
  const story = product.story ?? [];
  const photos = [product.image, ...product.gallery];

  return (
    <div>
      {/* Hero */}
      <section className="container grid gap-10 py-12 md:grid-cols-2 md:py-16">
        <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
          <Image src={product.image} alt={product.name} fill priority sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="label">Handmade in Khurja, India</span>
          <h1 className="display mt-4 text-balance text-4xl leading-[0.95] md:text-6xl">
            A village morning, poured into ceramic
          </h1>
          <p className="mt-3 font-hand text-2xl text-accent">hand-painted in Khurja — no two alike</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="font-mono text-2xl">{formatPrice(product.price, product.currency)}</span>
            <WhatsAppButton phone={phone} productName={product.name} productUrl={productUrl} className="px-6 py-3" />
          </div>
        </div>
      </section>

      {/* Story sections */}
      {story.map((s, i) => (
        <section key={s.title} className="container grid items-center gap-8 border-t border-border py-12 md:grid-cols-2">
          <div className={`relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted ${i % 2 ? "md:order-2" : ""}`}>
            <Image src={photos[(i + 1) % photos.length]} alt={s.title} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
          </div>
          <div>
            <HutIcon size={34} />
            <h2 className="display mt-3 text-3xl leading-tight md:text-4xl">{s.title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        </section>
      ))}

      {/* Specs */}
      <section className="container border-t border-border py-12">
        <span className="label">The full set</span>
        <dl className="mt-4 divide-y divide-border border-y border-border">
          {Object.entries(product.specs).map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-6 py-3">
              <dt className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">{k}</dt>
              <dd className="text-right text-sm font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
