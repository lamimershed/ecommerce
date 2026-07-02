import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { DotsCluster } from "@/components/motifs/dots-cluster";

/*
 * TODO: replace with real related Khurja products once the catalogue grows.
 * These are static placeholder cards (no 3D) reusing existing imagery.
 */
const ITEMS = [
  { name: "Khurja Blue Dinner Plates (Set of 6)", price: 1899, image: "/products/morning-hut/glasses.jpg" },
  { name: "Hand-Painted Serving Bowl", price: 1299, image: "/products/morning-hut/surahi-board.jpg" },
  { name: "Village Mug Duo", price: 999, image: "/products/morning-hut/surahi-table.jpg" },
];

export function CrossSell() {
  return (
    <section className="border-t border-border">
      <div className="container py-16 md:py-24">
        <div className="mb-10 flex flex-col gap-3">
          <span className="label">More from Khurja</span>
          <h2 className="display text-3xl leading-tight md:text-4xl">Pieces that pair beautifully</h2>
          <DotsCluster className="h-6 w-44" seed={5} />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {ITEMS.map((item) => (
            <div key={item.name} className="group flex flex-col gap-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-lg leading-tight">{item.name}</p>
                <span className="font-mono text-sm">{formatPrice(item.price, "INR")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
