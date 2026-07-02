"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus, Plus, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/use-cart";
import { HutIcon } from "@/components/motifs/hut-icon";
import { DotsCluster } from "@/components/motifs/dots-cluster";
import { WhatsAppButton } from "@/components/store/whatsapp-button";

const TRUST = [
  { icon: "hut", label: "Handmade in India" },
  { icon: ShieldCheck, label: "Secure payment" },
  { icon: Truck, label: "Ships across India" },
  { icon: RotateCcw, label: "Easy 7-day returns" },
] as const;

/** Beat 5 — the conversion module, over the settled beauty shot. */
export function PurchaseModule({
  product,
  phone,
  productUrl,
}: {
  product: Product;
  phone: string;
  productUrl: string;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(product.slug, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <section id="buy" className="relative flex min-h-[105svh] items-center">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto max-w-xl rounded-2xl border border-border bg-card/90 p-7 shadow-xl backdrop-blur-md sm:p-9"
        >
          <DotsCluster className="mx-auto h-6 w-48" seed={9} />
          <h2 className="display mt-4 text-center text-3xl leading-tight sm:text-4xl">
            Bring the village morning home
          </h2>
          <p className="mt-2 text-center font-hand text-xl text-accent">
            your set, painted just for you
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="font-mono text-3xl">
              {formatPrice(product.price, product.currency)}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#7A9E63" }} />
              {product.inStock ? "In stock" : "Made to order"}
            </span>
          </div>

          {/* Quantity */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="label">Quantity</span>
            <div className="inline-flex items-center rounded-full border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center hover:text-accent"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-mono text-sm">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center hover:text-accent"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary font-mono text-xs uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-accent"
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="inline-flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" /> Added to cart
                  </motion.span>
                ) : (
                  <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Add to cart
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <WhatsAppButton
              phone={phone}
              productName={product.name}
              productUrl={productUrl}
              label="Order on WhatsApp"
              className="h-12 w-full"
            />
            <p className="text-center font-hand text-lg text-muted-foreground">
              most customers order on WhatsApp — we reply fast
            </p>
          </div>

          {/* Trust row */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
            {TRUST.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 text-center">
                {item.icon === "hut" ? (
                  <HutIcon size={28} />
                ) : (
                  <item.icon className="h-6 w-6 text-primary" />
                )}
                <span className="text-xs leading-tight text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
