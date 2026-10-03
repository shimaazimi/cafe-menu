"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/context/CartContext";

export default function CartNavLink({ className = "" }: { className?: string }) {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="سبد خرید"
      className={`relative flex h-9 w-9 items-center justify-center ${className}`}
    >
      <ShoppingCart className="h-4.5 w-4.5" strokeWidth={1.5} />

      {totalItems > 0 && (
        <span className="bg-gold text-ink absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
