"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import ProductCard from "./ProductCard";

interface Product {
  slug: string;
  nameFa: string;
  description: string;
  priceFormatted: string;
  compareAtPriceFormatted?: string;
  discountPercent?: string;
  category: string;
  imageUrl?: string | null;
  coffeeType?: string | null;
  brewMethods: string[];
}

interface Props {
  products: Product[];
  categoryLabels: Record<string, string>;
}

export default function ShopGrid({ products, categoryLabels }: Props) {
  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products],
  );

  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const initialCategory =
    requestedCategory && categories.includes(requestedCategory) ? requestedCategory : "all";

  const [active, setActive] = useState<string>(initialCategory);

  const visible = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <div dir="rtl">
      <div className="no-scrollbar mb-5 flex flex-wrap justify-center gap-2 overflow-x-auto px-1 md:mb-8">
        <button
          onClick={() => setActive("all")}
          className={`font-farsi shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
            active === "all"
              ? "bg-espresso text-latte border-espresso"
              : "border-gold/25 text-espresso/70 bg-white"
          }`}
        >
          همه
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`font-farsi shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              active === category
                ? "bg-espresso text-latte border-espresso"
                : "border-gold/25 text-espresso/70 bg-white"
            }`}
          >
            {categoryLabels[category] ?? category}
          </button>
        ))}
      </div>

      <div className="mx-auto grid max-w-md grid-cols-2 gap-3 md:max-w-6xl md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {visible.map((product) => (
          <ProductCard
            key={product.slug}
            id={product.slug}
            name={product.nameFa}
            description={product.description}
            price={product.priceFormatted}
            compareAtPrice={product.compareAtPriceFormatted}
            discountPercent={product.discountPercent}
            category={product.category}
            imageUrl={product.imageUrl}
            coffeeType={product.coffeeType}
            brewMethods={product.brewMethods}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="font-farsi text-clay mt-16 text-center">محصولی در این دسته نیست.</p>
      )}
    </div>
  );
}
