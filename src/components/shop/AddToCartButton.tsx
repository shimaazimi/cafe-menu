"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";

import { useCart } from "@/context/CartContext";

interface Props {
  id: string;
  name: string;
  price: string;
  image?: string | null;
  wide?: boolean;
}

export default function AddToCartButton({ id, name, price, image, wide = false }: Props) {
  const { getQuantity, add, remove } = useCart();
  const item = { id, name, price, image: image ?? undefined };
  const quantity = getQuantity(id);

  if (quantity === 0) {
    return (
      <button
        onClick={() => add(item)}
        className={`bg-gold text-ink hover:bg-gold-light flex items-center justify-center gap-2 rounded-full font-bold transition active:scale-95 ${
          wide ? "font-farsi w-full px-6 py-3" : "h-8 w-8"
        }`}
        aria-label="افزودن به سبد خرید"
      >
        {wide ? <ShoppingBag className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {wide && "افزودن به سبد خرید"}
      </button>
    );
  }

  return (
    <div
      className={`bg-espresso text-latte flex items-center justify-center gap-3 rounded-full ${
        wide ? "w-full px-4 py-2.5" : "px-1.5 py-1"
      }`}
    >
      <button onClick={() => add(item)} aria-label="افزایش تعداد" className="p-1">
        <Plus className="h-4 w-4" />
      </button>
      <span className="min-w-4 text-center text-sm font-bold">{quantity}</span>
      <button onClick={() => remove(id)} aria-label="کاهش تعداد" className="p-1">
        <Minus className="h-4 w-4" />
      </button>
    </div>
  );
}
