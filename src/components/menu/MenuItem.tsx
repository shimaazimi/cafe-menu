"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";

import { useCart } from "@/context/CartContext";

interface Props {
  item: {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
  };
}

export default function MenuItem({ item }: Props) {
  const { getQuantity, add, remove } = useCart();
  const quantity = getQuantity(item.id);

  return (
    <li>
      <div className="flex items-center gap-4 py-4" dir="rtl">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
          <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
        </div>

        <div className="flex-1 text-right">
          <h3 className="font-farsi text-espresso font-semibold">{item.name}</h3>

          <p className="font-farsi text-clay text-sm">{item.description}</p>

          <span className="text-espresso text-sm font-semibold">{item.price}</span>
        </div>

        {quantity === 0 ? (
          <button
            onClick={() => add(item)}
            aria-label="افزودن به سبد خرید"
            className="border-espresso/20 text-espresso flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition active:scale-95"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          </button>
        ) : (
          <div className="bg-espresso text-latte flex shrink-0 items-center gap-3 rounded-full px-2 py-1">
            <button
              onClick={() => add(item)}
              aria-label="افزایش تعداد"
              className="flex h-6 w-6 items-center justify-center"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            </button>

            <span className="min-w-4 text-center text-sm font-semibold">{quantity}</span>

            <button
              onClick={() => remove(item.id)}
              aria-label="کاهش تعداد"
              className="flex h-6 w-6 items-center justify-center"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
