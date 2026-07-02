"use client";

import { useCallback, useEffect, useState } from "react";

// Lightweight, WhatsApp-first cart persisted to localStorage.
// TODO: replace with a real cart/checkout backend when payments go live.
const KEY = "mh_cart";
const EVENT = "mh-cart-change";

interface CartItem {
  slug: string;
  qty: number;
}

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function useCart() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(read().reduce((n, i) => n + i.qty, 0));
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((slug: string, qty = 1) => {
    const cart = read();
    const existing = cart.find((i) => i.slug === slug);
    if (existing) existing.qty += qty;
    else cart.push({ slug, qty });
    localStorage.setItem(KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { count, add };
}
