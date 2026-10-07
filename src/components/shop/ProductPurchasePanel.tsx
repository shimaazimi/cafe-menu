"use client";

import Link from "next/link";
import { useState } from "react";

import AddToCartButton from "@/components/shop/AddToCartButton";
import { formatToman } from "@/lib/price";
import { formatPackageWeight, getPackageOptions } from "@/lib/productPackages";
import { buildCartItemId, getCustomerGrindOptions } from "@/lib/grindOptions";

interface Props {
  slug: string;
  name: string;
  image?: string | null;
  basePriceToman: number;
  price250g?: number | null;
  price500g?: number | null;
  price1000g?: number | null;
  isAvailable: boolean;
  priceOnRequest: boolean;
  catalogOnly: boolean;
  grindingAvailable: boolean;
  grindOptions: string[];
}

export default function ProductPurchasePanel({
  slug,
  name,
  image,
  basePriceToman,
  price250g,
  price500g,
  price1000g,
  isAvailable,
  priceOnRequest,
  catalogOnly,
  grindingAvailable,
  grindOptions,
}: Props) {
  const options = getPackageOptions({ price250g, price500g, price1000g });
  const [selectedWeight, setSelectedWeight] = useState<number | null>(
    options[0]?.weightGrams ?? null,
  );
  const customerGrindOptions = getCustomerGrindOptions(grindingAvailable, grindOptions);
  const [selectedGrind, setSelectedGrind] = useState("");
  const selectedPrice =
    options.find((option) => option.weightGrams === selectedWeight)?.priceToman ?? basePriceToman;

  return (
    <div className="mt-auto pt-8">
      {options.length > 0 && (
        <div className="mb-5">
          <p className="font-farsi text-espresso mb-2 text-sm font-bold">انتخاب وزن</p>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="انتخاب وزن محصول">
            {options.map((option) => {
              const active = selectedWeight === option.weightGrams;

              return (
                <button
                  key={option.weightGrams}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelectedWeight(option.weightGrams)}
                  className={`font-farsi rounded-xl border px-2 py-2.5 text-sm font-bold transition ${
                    active
                      ? "border-gold bg-gold text-ink shadow-sm"
                      : "border-gold/25 bg-parchment text-espresso hover:border-gold/60"
                  }`}
                >
                  <span>{formatPackageWeight(option.weightGrams)}</span>
                  <span className="mt-1 block text-[10px] font-normal">
                    {formatToman(option.priceToman)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {customerGrindOptions.length > 0 && (
        <div className="mb-5">
          <label
            htmlFor={`grind-${slug}`}
            className="font-farsi text-espresso mb-2 block text-sm font-bold"
          >
            نوع آسیاب
          </label>
          <select
            id={`grind-${slug}`}
            value={selectedGrind}
            onChange={(event) => setSelectedGrind(event.target.value)}
            className="font-farsi border-gold/25 text-espresso focus:border-gold w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
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
        </div>
      )}

      <p className="font-farsi text-espresso mb-4 text-xl font-black">
        {priceOnRequest ? "استعلام قیمت" : formatToman(selectedPrice)}
        {!priceOnRequest && selectedWeight && (
          <span className="text-clay mr-2 text-xs font-normal">
            بسته {formatPackageWeight(selectedWeight)}
          </span>
        )}
      </p>

      {!isAvailable ? (
        <button
          type="button"
          disabled
          className="font-farsi bg-clay/20 text-clay flex w-full items-center justify-center rounded-full px-6 py-3 font-bold"
        >
          ناموجود
        </button>
      ) : catalogOnly || priceOnRequest ? (
        <Link
          href="/business"
          className="font-farsi bg-gold text-ink hover:bg-gold-light flex w-full items-center justify-center rounded-full px-6 py-3 font-bold transition"
        >
          استعلام خرید عمده
        </Link>
      ) : (
        <AddToCartButton
          id={buildCartItemId(slug, selectedWeight ?? undefined, selectedGrind || undefined)}
          productSlug={slug}
          name={name}
          price={formatToman(selectedPrice)}
          image={image}
          weightGrams={selectedWeight ?? undefined}
          grindOption={selectedGrind || undefined}
          disabled={customerGrindOptions.length > 0 && !selectedGrind}
          wide
        />
      )}
    </div>
  );
}
