import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bean, Check, Coffee, Gauge, Package } from "lucide-react";
import { notFound } from "next/navigation";

import ProductPurchasePanel from "@/components/shop/ProductPurchasePanel";
import {
  BREW_METHOD_LABELS,
  COFFEE_TYPE_LABELS,
  FLAVOR_NOTE_LABELS,
  ROAST_LEVEL_LABELS,
  SUITABLE_FOR_LABELS,
  intensityDots,
} from "@/lib/coffeeProduct";
import { toPersianDigits } from "@/lib/price";
import { prisma } from "@/lib/prisma";
import { formatPackageWeight, getPackageOptions } from "@/lib/productPackages";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  const isCoffee = Boolean(product.productForm || product.coffeeType);
  const packageOptions = getPackageOptions(product);

  return (
    <main dir="rtl" className="bg-latte min-h-screen px-5 py-8 pb-24 md:px-10 md:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/shop"
          className="font-farsi text-clay mb-5 inline-flex items-center gap-2 text-sm"
        >
          <ArrowRight className="h-4 w-4" /> بازگشت به فروشگاه
        </Link>

        <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-sm md:grid-cols-2">
          <div className="bg-parchment relative flex min-h-72 items-center justify-center md:min-h-[520px]">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.nameFa}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : isCoffee ? (
              <Bean className="text-gold h-24 w-24" strokeWidth={1} />
            ) : (
              <Package className="text-gold h-24 w-24" strokeWidth={1} />
            )}
          </div>

          <div className="flex flex-col p-6 md:p-10">
            <span className="font-farsi text-gold text-sm font-bold">
              {product.coffeeType ? COFFEE_TYPE_LABELS[product.coffeeType] : "کافه فرندز"}
            </span>
            <h1 className="font-farsi-display text-espresso mt-2 text-3xl leading-relaxed md:text-4xl">
              {product.nameFa}
            </h1>
            <p className="font-farsi text-clay mt-3 leading-8">{product.description}</p>

            {isCoffee && (
              <div className="border-gold/15 my-6 grid grid-cols-2 gap-3 border-y py-5 text-sm">
                <Stat
                  label="رست"
                  value={product.roastLevel ? ROAST_LEVEL_LABELS[product.roastLevel] : "—"}
                />
                <Stat
                  label="وزن‌های موجود"
                  value={
                    packageOptions.length > 0
                      ? packageOptions
                          .map((option) => formatPackageWeight(option.weightGrams))
                          .join("، ")
                      : product.weightGrams
                        ? `${toPersianDigits(product.weightGrams)} گرم`
                        : "—"
                  }
                />
                <Stat label="شدت" value={intensityDots(product.strength)} />
                <Stat label="تلخی" value={intensityDots(product.bitterness)} />
                <Stat label="بادی" value={intensityDots(product.body)} />
                <Stat label="کافئین" value={intensityDots(product.caffeineLevel)} />
                {product.originCountry && <Stat label="مبدأ" value={product.originCountry} />}
                {product.grade && <Stat label="گرید" value={product.grade} />}
                {product.arabicaPercent !== null && product.robustaPercent !== null && (
                  <Stat
                    label="ترکیب"
                    value={`${toPersianDigits(product.arabicaPercent)}٪ عربیکا / ${toPersianDigits(product.robustaPercent)}٪ روبوستا`}
                  />
                )}
                {product.minimumOrderGrams && (
                  <Stat
                    label="حداقل سفارش"
                    value={`${toPersianDigits(product.minimumOrderGrams / 1000)} کیلوگرم`}
                  />
                )}
              </div>
            )}

            {product.flavorNotes.length > 0 && (
              <InfoList title="طعم‌هایی که حس می‌کنید" icon={Coffee}>
                {product.flavorNotes.map((note) => FLAVOR_NOTE_LABELS[note] ?? note)}
              </InfoList>
            )}
            {product.brewMethods.length > 0 && (
              <InfoList title="مناسب برای دم‌آوری" icon={Gauge}>
                {product.brewMethods.map((method) => BREW_METHOD_LABELS[method] ?? method)}
              </InfoList>
            )}
            {product.suitableFor.length > 0 && (
              <InfoList title="انتخاب خوب برای" icon={Check}>
                {product.suitableFor.map((use) => SUITABLE_FOR_LABELS[use] ?? use)}
              </InfoList>
            )}

            <ProductPurchasePanel
              slug={product.slug}
              name={product.nameFa}
              image={product.imageUrl}
              basePriceToman={product.priceToman}
              price250g={product.price250g}
              price500g={product.price500g}
              price1000g={product.price1000g}
              isAvailable={product.isAvailable}
              priceOnRequest={product.priceOnRequest}
              catalogOnly={product.catalogOnly}
              grindingAvailable={product.grindingAvailable}
              grindOptions={product.grindOptions}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-farsi text-clay text-xs">{label}</p>
      <p className="font-farsi text-espresso mt-1 font-bold">{value}</p>
    </div>
  );
}

function InfoList({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Coffee;
  children: string[];
}) {
  return (
    <div className="mt-4">
      <p className="font-farsi text-espresso flex items-center gap-2 text-sm font-bold">
        <Icon className="text-gold h-4 w-4" /> {title}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {children.map((value) => (
          <span key={value} className="bg-parchment text-clay rounded-full px-3 py-1 text-xs">
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
