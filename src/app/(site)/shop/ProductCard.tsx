"use client";

import Image from "next/image";
import { Bean, Box, Coffee, Minus, Package, Plus, type LucideIcon } from "lucide-react";

import { useCart } from "@/context/CartContext";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  mug: Coffee,
  "french-press": Box,
  beans: Bean,
};

interface Props {
  id: string;
  name: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  discountPercent?: string;
  category: string;
  imageUrl?: string | null;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  compareAtPrice,
  discountPercent,
  category,
  imageUrl,
}: Props) {
  const Icon = CATEGORY_ICONS[category] ?? Package;
  const { getQuantity, add, remove } = useCart();
  const quantity = getQuantity(id);

  return (
    <div
      dir="rtl"
      className="border-gold/15 flex flex-col rounded-2xl border bg-white p-3 shadow-sm md:p-4"
    >
      <div className="bg-latte border-gold/15 relative mb-3 flex h-24 items-center justify-center overflow-hidden rounded-xl border md:h-32">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(min-width: 768px) 200px, 45vw"
            className="object-cover"
          />
        ) : (
          <Icon className="text-espresso/50 h-9 w-9 md:h-11 md:w-11" strokeWidth={1.25} />
        )}

        {discountPercent && (
          <span className="bg-ink text-gold-light absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold">
            {discountPercent}
          </span>
        )}
      </div>

      <h3 className="font-farsi text-espresso text-sm leading-6 font-semibold md:text-base">
        {name}
      </h3>

      <p className="font-farsi text-clay mb-2 line-clamp-2 text-xs leading-5 md:text-sm">
        {description}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <div className="flex flex-col">
          {compareAtPrice && (
            <span className="text-clay/70 text-[10px] line-through">{compareAtPrice}</span>
          )}
          <span className="text-espresso text-xs font-bold">{price}</span>
        </div>

        {quantity === 0 ? (
          <button
            onClick={() => add({ id, name, price })}
            aria-label="افزودن به سبد خرید"
            className="bg-gold text-ink flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition active:scale-95"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </button>
        ) : (
          <div className="bg-espresso text-latte flex shrink-0 items-center gap-2 rounded-full px-1.5 py-1">
            <button
              onClick={() => add({ id, name, price })}
              aria-label="افزایش تعداد"
              className="flex h-5 w-5 items-center justify-center"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            </button>

            <span className="min-w-3 text-center text-xs font-semibold">{quantity}</span>

            <button
              onClick={() => remove(id)}
              aria-label="کاهش تعداد"
              className="flex h-5 w-5 items-center justify-center"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
