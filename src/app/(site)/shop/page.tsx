import { Suspense } from "react";

import { prisma } from "@/lib/prisma";
import { formatDiscountPercent, formatToman } from "@/lib/price";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/productCategories";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import ShopGrid from "./ShopGrid";
import { WEIGHT_PRICED_CATEGORIES } from "@/lib/productPackages";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { category: { in: [...WEIGHT_PRICED_CATEGORIES] }, isAvailable: true },
        { category: { notIn: [...WEIGHT_PRICED_CATEGORIES] }, stockQuantity: { gt: 0 } },
      ],
    },
    orderBy: { id: "asc" },
  });

  return (
    <main dir="rtl" className="bg-latte min-h-screen">
      <div className="bg-ink px-6 pt-8 pb-6 text-center md:py-12">
        <h1 className="font-farsi-display text-gold-light text-2xl md:text-4xl">فروشگاه</h1>
        <p className="font-farsi text-latte/60 mx-auto mt-2 max-w-xs text-sm md:max-w-none md:text-base">
          محصولات با کیفیت برای خانه و محل کار
        </p>
        <Link
          href="/coffee-finder"
          className="font-farsi border-gold/30 text-gold-light mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold"
        >
          <Sparkles className="h-3.5 w-3.5" /> برای انتخاب قهوه کمک می‌خواهم
        </Link>
      </div>

      <div className="divider-ornate" aria-hidden />

      <div className="px-6 pt-6 pb-16 md:px-8 md:pt-8 lg:px-12">
        <Suspense fallback={null}>
          <ShopGrid
            products={products.map((product) => {
              const hasDiscount =
                product.compareAtPrice !== null && product.compareAtPrice > product.priceToman;

              return {
                slug: product.slug,
                nameFa: product.nameFa,
                description: product.description,
                priceFormatted: formatToman(product.priceToman),
                price250g: product.price250g,
                price500g: product.price500g,
                price1000g: product.price1000g,
                isAvailable: product.isAvailable,
                catalogOnly: product.catalogOnly,
                priceOnRequest: product.priceOnRequest,
                compareAtPriceFormatted: hasDiscount
                  ? formatToman(product.compareAtPrice!)
                  : undefined,
                discountPercent: hasDiscount
                  ? formatDiscountPercent(product.priceToman, product.compareAtPrice!)
                  : undefined,
                category: product.category,
                imageUrl: product.imageUrl,
                coffeeType: product.coffeeType,
                brewMethods: product.brewMethods,
                grindingAvailable: product.grindingAvailable,
                grindOptions: product.grindOptions,
              };
            })}
            categoryLabels={PRODUCT_CATEGORY_LABELS}
          />
        </Suspense>

        {products.length === 0 && (
          <p className="font-farsi text-clay mt-16 text-center">فعلاً محصولی موجود نیست.</p>
        )}
      </div>

      <div className="h-16 md:hidden" aria-hidden />
    </main>
  );
}
