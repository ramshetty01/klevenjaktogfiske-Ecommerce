"use client";

import { create } from "zustand";
import type { CartItem, Product } from "./types";

interface CartState {
  /** Cart line items (with product joined). */
  items: CartItem[];
  /** Total quantity across all lines. */
  totalCount: number;
  /** Sum of price × quantity, in NOK. */
  subtotal: number;
  /** True while waiting for the initial GET /api/cart to resolve. */
  loading: boolean;
  /** Set after the first load so the UI can show skeletons only once. */
  initialized: boolean;

  /** Fetch /api/cart and populate state. Called once on app mount. */
  hydrate: () => Promise<void>;
  /** Add a product to the cart. Returns the new totalCount. */
  add: (product: Product, quantity?: number) => Promise<void>;
  /** Set a specific cart line's quantity (1–99). 0 removes the line. */
  setQuantity: (itemId: string, quantity: number) => Promise<void>;
  /** Remove a cart line entirely. */
  remove: (itemId: string) => Promise<void>;
  /** Empty the cart. */
  clear: () => Promise<void>;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  totalCount: 0,
  subtotal: 0,
  loading: false,
  initialized: false,

  hydrate: async () => {
    if (get().initialized || get().loading) return;
    set({ loading: true });
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) throw new Error("Kunne ikke hente handlevogn");
      const data = await res.json();
      set({
        items: data.items ?? [],
        totalCount: data.totalCount ?? 0,
        subtotal: data.subtotal ?? 0,
        loading: false,
        initialized: true,
      });
    } catch {
      set({ loading: false, initialized: true });
    }
  },

  add: async (product, quantity = 1) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      if (!res.ok) throw new Error("Kunne ikke legge til i handlevogn");
      const data = await res.json();
      // Refetch full cart so items array stays in sync
      const fresh = await fetch("/api/cart", { cache: "no-store" });
      const freshData = await fresh.json();
      set({
        items: freshData.items ?? [],
        totalCount: data.totalCount,
        subtotal: data.subtotal,
        loading: false,
        initialized: true,
      });
    } catch {
      set({ loading: false });
      throw new Error("Kunne ikke legge til i handlevogn");
    }
  },

  setQuantity: async (itemId, quantity) => {
    if (quantity <= 0) {
      return get().remove(itemId);
    }
    // Optimistic update
    const prev = get().items;
    const next = prev.map((i) =>
      i.id === itemId ? { ...i, quantity: Math.min(99, quantity) } : i,
    );
    const totalCount = next.reduce((s, i) => s + i.quantity, 0);
    const subtotal = next.reduce((s, i) => s + i.product.price * i.quantity, 0);
    set({ items: next, totalCount, subtotal });

    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error("Kunne ikke oppdatere antall");
      const data = await res.json();
      set({ totalCount: data.totalCount, subtotal: data.subtotal });
    } catch {
      // Revert on failure
      set({ items: prev });
      const totalCount = prev.reduce((s, i) => s + i.quantity, 0);
      const subtotal = prev.reduce((s, i) => s + i.product.price * i.quantity, 0);
      set({ totalCount, subtotal });
    }
  },

  remove: async (itemId) => {
    const prev = get().items;
    const next = prev.filter((i) => i.id !== itemId);
    const totalCount = next.reduce((s, i) => s + i.quantity, 0);
    const subtotal = next.reduce((s, i) => s + i.product.price * i.quantity, 0);
    set({ items: next, totalCount, subtotal });

    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Kunne ikke fjerne artikkelen");
      const data = await res.json();
      set({ totalCount: data.totalCount, subtotal: data.subtotal });
    } catch {
      set({ items: prev });
      const totalCount = prev.reduce((s, i) => s + i.quantity, 0);
      const subtotal = prev.reduce((s, i) => s + i.product.price * i.quantity, 0);
      set({ totalCount, subtotal });
    }
  },

  clear: async () => {
    set({ items: [], totalCount: 0, subtotal: 0 });
    try {
      await fetch("/api/cart/all", { method: "DELETE" });
    } catch {
      /* ignore — optimistic already applied */
    }
  },
}));
