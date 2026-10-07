"use client";

import { useMemo, useSyncExternalStore } from "react";

import { parseTomanPrice } from "@/lib/price";

const STORAGE_KEY = "cafe-friends-cart";

export interface CartItem {
  id: string;
  productSlug?: string;
  name: string;
  price: string;
  image?: string;
  weightGrams?: number;
  grindOption?: string;
}

interface CartEntry {
  item: CartItem;
  quantity: number;
}

type CartEntries = Record<string, CartEntry>;

const EMPTY_ENTRIES: CartEntries = {};

export interface CartLine {
  item: CartItem;
  quantity: number;
  lineTotal: number;
}

function isCartEntry(value: unknown): value is CartEntry {
  if (!value || typeof value !== "object") return false;

  const entry = value as Partial<CartEntry>;

  return (
    typeof entry.quantity === "number" &&
    !!entry.item &&
    typeof entry.item === "object" &&
    typeof entry.item.id === "string" &&
    typeof entry.item.name === "string" &&
    typeof entry.item.price === "string" &&
    (entry.item.productSlug === undefined || typeof entry.item.productSlug === "string") &&
    (entry.item.weightGrams === undefined || typeof entry.item.weightGrams === "number") &&
    (entry.item.grindOption === undefined || typeof entry.item.grindOption === "string")
  );
}

function readStorage(): CartEntries {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") return {};

    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(([, value]) => isCartEntry(value)),
    ) as CartEntries;
  } catch {
    return {};
  }
}

class CartStore {
  private entries: CartEntries = EMPTY_ENTRIES;
  private listeners = new Set<() => void>();

  constructor() {
    if (typeof window !== "undefined") {
      this.entries = readStorage();
    }
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.entries;

  getServerSnapshot = () => EMPTY_ENTRIES;

  private commit(next: CartEntries) {
    this.entries = next;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    this.listeners.forEach((listener) => listener());
  }

  add(item: CartItem) {
    const currentQuantity = this.entries[item.id]?.quantity ?? 0;

    this.commit({ ...this.entries, [item.id]: { item, quantity: currentQuantity + 1 } });
  }

  remove(itemId: string) {
    const currentQuantity = this.entries[itemId]?.quantity ?? 0;

    this.setQuantity(itemId, currentQuantity - 1);
  }

  setQuantity(itemId: string, quantity: number) {
    const { [itemId]: existing, ...rest } = this.entries;

    if (quantity <= 0 || !existing) {
      this.commit(rest);
      return;
    }

    this.commit({ ...rest, [itemId]: { item: existing.item, quantity } });
  }

  clear() {
    this.commit({});
  }
}

const cartStore = new CartStore();

export function useCart() {
  const entries = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );

  const lines = useMemo<CartLine[]>(() => {
    return Object.values(entries).map(({ item, quantity }) => ({
      item,
      quantity,
      lineTotal: parseTomanPrice(item.price) * quantity,
    }));
  }, [entries]);

  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalPrice = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  return {
    lines,
    totalItems,
    totalPrice,
    getQuantity: (itemId: string) => entries[itemId]?.quantity ?? 0,
    add: (item: CartItem) => cartStore.add(item),
    remove: (itemId: string) => cartStore.remove(itemId),
    setQuantity: (itemId: string, quantity: number) => cartStore.setQuantity(itemId, quantity),
    clear: () => cartStore.clear(),
  };
}
