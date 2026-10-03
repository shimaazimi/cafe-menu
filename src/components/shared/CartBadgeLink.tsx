"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/context/CartContext";

export default function CartBadgeLink() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="سبد خرید"
      className="border-espresso/20 text-espresso absolute top-8 left-6 flex h-10 w-10 items-center justify-center rounded-full border bg-white/70"
    >
      <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />

      {totalItems > 0 && (
        <span className="bg-espresso text-latte absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
