"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/use-cart";
import { buildWhatsAppHref } from "@/components/store/whatsapp-button";

/** Persistent conversion bar that slides in once the hero is scrolled past. */
export function StickyBar({
  product,
  phone,
  productUrl,
}: {
  product: Product;
  phone: string;
  productUrl: string;
}) {
  const { count, add } = useCart();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waHref = buildWhatsAppHref({ phone, productName: product.name, productUrl });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl"
        >
          <div className="container flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm leading-tight sm:text-base">
                {product.name}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {formatPrice(product.price, product.currency)}
                {count > 0 && ` · ${count} in bag`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => add(product.slug, 1)}
              aria-label="Add to cart"
              className="hidden h-10 items-center gap-2 rounded-full border border-border px-4 font-mono text-xs uppercase tracking-[0.14em] hover:bg-secondary sm:inline-flex"
            >
              <ShoppingBag className="h-4 w-4" />
              Add
            </button>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#25D366] px-5 font-mono text-xs uppercase tracking-[0.14em] text-[#04331c]"
            >
              Order
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
