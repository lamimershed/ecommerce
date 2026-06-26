import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { FolkDots } from "@/components/store/folk-dots";

/**
 * "The set" — surfaces the real product photography on the home page in place
 * of a redundant single-card grid. Captions are paired with the product's own
 * images (hero image + gallery).
 */
export function HomeSetShowcase({ product }: { product: Product }) {
  const captions = [
    "The complete 5-piece set",
    "The tall surahi pitcher",
    "Four matching glasses",
    "Hand-painted village scene",
  ];
  const photos = [product.image, ...product.gallery]
    .slice(0, 3)
    .map((src, i) => ({ src, caption: captions[i] ?? "" }));

  return (
    <section id="set" className="surface-wood scroll-mt-20 border-b border-border">
      <div className="container py-20 md:py-28">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <span className="label">The set</span>
            <h2 className="display text-4xl leading-[1.02] tracking-tight md:text-5xl">
              Five hand-painted pieces
            </h2>
            <FolkDots className="mt-1" />
          </div>
          <Link
            href={`/${product.slug}`}
            className="link-underline inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.16em]"
          >
            Explore the full story
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, i) => (
            <Link
              key={photo.src}
              href={`/${product.slug}`}
              className="group flex flex-col gap-3"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border bg-card">
                <Image
                  src={photo.src}
                  alt={`${product.name} — ${photo.caption}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-lg leading-tight">{photo.caption}</p>
                <span className="label shrink-0">{String(i + 1).padStart(2, "0")}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
