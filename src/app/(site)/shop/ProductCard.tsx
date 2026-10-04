"use client";

import Image from "next/image";
import Link from "next/link";
import { Bean, Box, Coffee, Package, type LucideIcon } from "lucide-react";

import AddToCartButton from "@/components/shop/AddToCartButton";
import { BREW_METHOD_LABELS, COFFEE_TYPE_LABELS } from "@/lib/coffeeProduct";

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
  coffeeType?: string | null;
  brewMethods?: string[];
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
  coffeeType,
  brewMethods = [],
}: Props) {
  const Icon = CATEGORY_ICONS[category] ?? Package;

  return (
    <div
      dir="rtl"
      className="border-gold/15 flex flex-col rounded-2xl border bg-white p-3 shadow-sm md:p-4"
    >
      <Link
        href={`/shop/${id}`}
        className="bg-latte border-gold/15 relative mb-3 flex h-24 items-center justify-center overflow-hidden rounded-xl border md:h-32"
      >
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
      </Link>

      <Link href={`/shop/${id}`}>
        <h3 className="font-farsi text-espresso text-sm leading-6 font-semibold md:text-base">
          {name}
        </h3>
      </Link>

      {coffeeType && (
        <div className="my-1.5 flex flex-wrap gap-1">
          <span className="bg-parchment text-clay rounded-full px-2 py-0.5 text-[10px] font-bold">
            {COFFEE_TYPE_LABELS[coffeeType] ?? coffeeType}
          </span>
          {brewMethods.slice(0, 1).map((method) => (
            <span
              key={method}
              className="bg-parchment text-clay rounded-full px-2 py-0.5 text-[10px]"
            >
              {BREW_METHOD_LABELS[method] ?? method}
            </span>
          ))}
        </div>
      )}

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

        <AddToCartButton id={id} name={name} price={price} image={imageUrl} />
      </div>
    </div>
  );
}
