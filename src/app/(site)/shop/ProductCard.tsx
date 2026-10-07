"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Bean, Box, Coffee, Package, type LucideIcon } from "lucide-react";

import AddToCartButton from "@/components/shop/AddToCartButton";
import { BREW_METHOD_LABELS, COFFEE_TYPE_LABELS } from "@/lib/coffeeProduct";
import { formatToman } from "@/lib/price";
import { formatPackageWeight, getPackageOptions } from "@/lib/productPackages";
import { buildCartItemId, getCustomerGrindOptions } from "@/lib/grindOptions";

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
  price250g?: number | null;
  price500g?: number | null;
  price1000g?: number | null;
  isAvailable: boolean;
  catalogOnly: boolean;
  priceOnRequest: boolean;
  compareAtPrice?: string;
  discountPercent?: string;
  category: string;
  imageUrl?: string | null;
  coffeeType?: string | null;
  brewMethods?: string[];
  grindingAvailable?: boolean;
  grindOptions?: string[];
  badge?: string;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  price250g,
  price500g,
  price1000g,
  isAvailable,
  catalogOnly,
  priceOnRequest,
  compareAtPrice,
  discountPercent,
  category,
  imageUrl,
  coffeeType,
  brewMethods = [],
  grindingAvailable = false,
  grindOptions = [],
  badge,
}: Props) {
  const Icon = CATEGORY_ICONS[category] ?? Package;
  const packageOptions = getPackageOptions({ price250g, price500g, price1000g });
  const [selectedWeight, setSelectedWeight] = useState<number | null>(
    packageOptions[0]?.weightGrams ?? null,
  );
  const customerGrindOptions = getCustomerGrindOptions(grindingAvailable, grindOptions);
  const [selectedGrind, setSelectedGrind] = useState("");
  const selectedOption = packageOptions.find((option) => option.weightGrams === selectedWeight);
  const displayPrice = selectedOption ? formatToman(selectedOption.priceToman) : price;
  const displayCompareAtPrice = selectedOption ? undefined : compareAtPrice;

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
        {badge && !discountPercent && (
          <span className="bg-gold text-ink absolute top-2 right-2 rounded-full px-2 py-1 text-[10px] font-bold">
            {badge}
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

      {packageOptions.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-1">
          {packageOptions.map((option) => (
            <button
              key={option.weightGrams}
              type="button"
              onClick={() => setSelectedWeight(option.weightGrams)}
              className={`font-farsi rounded-lg border px-1 py-1.5 text-[10px] font-bold transition ${
                selectedWeight === option.weightGrams
                  ? "border-gold bg-gold text-ink"
                  : "border-gold/20 text-clay bg-parchment"
              }`}
            >
              {formatPackageWeight(option.weightGrams)}
            </button>
          ))}
        </div>
      )}

      {customerGrindOptions.length > 0 && (
        <select
          value={selectedGrind}
          onChange={(event) => setSelectedGrind(event.target.value)}
          aria-label={`نوع آسیاب ${name}`}
          className="font-farsi border-gold/20 text-espresso bg-parchment mb-3 w-full rounded-lg border px-2 py-2 text-[11px] outline-none"
        >
          <option value="" disabled>
            نوع آسیاب را انتخاب کنید
          </option>
          {customerGrindOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      <div className="mt-auto flex items-center justify-between">
        <div className="flex flex-col">
          {displayCompareAtPrice && (
            <span className="text-clay/70 text-[10px] line-through">{displayCompareAtPrice}</span>
          )}
          <span className="text-espresso text-xs font-bold">
            {priceOnRequest ? "استعلام قیمت" : displayPrice}
          </span>
          {selectedOption && (
            <span className="text-clay text-[10px]">
              {formatPackageWeight(selectedOption.weightGrams)}
            </span>
          )}
        </div>

        {!isAvailable ? (
          <span className="bg-clay/15 text-clay rounded-full px-3 py-2 text-xs font-bold">
            ناموجود
          </span>
        ) : catalogOnly || priceOnRequest ? (
          <Link
            href={`/shop/${id}`}
            className="bg-gold text-ink flex h-8 items-center rounded-full px-3 text-xs font-bold"
          >
            مشاهده
          </Link>
        ) : (
          <AddToCartButton
            id={buildCartItemId(id, selectedOption?.weightGrams, selectedGrind || undefined)}
            productSlug={id}
            name={name}
            price={displayPrice}
            image={imageUrl}
            weightGrams={selectedOption?.weightGrams}
            grindOption={selectedGrind || undefined}
            disabled={customerGrindOptions.length > 0 && !selectedGrind}
          />
        )}
      </div>
    </div>
  );
}
