import Image from "next/image";
import Link from "next/link";
import { Bean, Box, Coffee, Gift, Landmark, Truck } from "lucide-react";

import { categories } from "@/data/categories";

const FEATURED_IDS = ["friends-special", "cappuccino", "mocha"];

const featuredItems = FEATURED_IDS.map((id) =>
  categories.flatMap((category) => category.items).find((item) => item.id === id),
).filter((item): item is NonNullable<typeof item> => Boolean(item));

const FEATURES = [
  { icon: Landmark, title: "فضای سنتی و دلنشین", desc: "الهام گرفته از بازار بزرگ تهران" },
  { icon: Bean, title: "قهوه با کیفیت", desc: "دانه‌های منتخب از بهترین مزارع دنیا" },
  { icon: Coffee, title: "تازه و روزانه", desc: "دم‌آوری شده با دانه‌های تازه رست" },
  { icon: Truck, title: "ارسال به سراسر کشور", desc: "بسته‌بندی مطمئن، ارسال سریع" },
  { icon: Gift, title: "هدیه‌ای خاص", desc: "برای عزیزانتان" },
];

const SHOP_CATEGORIES = [
  { icon: Coffee, label: "ماگ", category: "mug" },
  { icon: Box, label: "فرنچ پرس", category: "french-press" },
  { icon: Bean, label: "دانه قهوه", category: "beans" },
];

export default function Home() {
  return (
    <div className="bg-latte relative min-h-screen">
      <main
        dir="rtl"
        className="bg-ink relative overflow-hidden px-6 pt-10 pb-14 text-center md:py-24"
      >
        <div className="bg-arabesque pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--color-gold) 12%, transparent), transparent 60%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-2xl">
          <span className="border-gold/30 bg-gold/10 text-gold-light font-farsi mb-6 inline-block rounded-full border px-4 py-1 text-sm">
            به کافه فرندز خوش آمدید
          </span>

          <h1 className="font-farsi-display text-gold-light mb-4 text-4xl leading-[1.5] font-normal text-balance md:text-6xl md:leading-[1.4]">
            طعم اصیل
            <br />
            در دل بازار تهران
          </h1>

          <div className="border-gold/40 mx-auto mb-5 w-24 border-t" />

          <p className="font-farsi text-latte/70 mx-auto mb-10 max-w-xs leading-8 md:max-w-md md:text-lg">
            کافه فرندز جایی است برای آرامش، عطر قهوه و خاطره‌های به یاد ماندنی...
          </p>

          <div className="flex flex-col items-center gap-3">
            <Link
              href="/shop"
              className="font-farsi bg-gold text-ink hover:bg-gold-light inline-flex w-full max-w-xs items-center justify-center rounded-full px-8 py-4 text-base font-bold tracking-wide transition md:w-auto md:px-12"
            >
              فروشگاه
            </Link>
          </div>
        </div>
      </main>

      <div className="divider-ornate" aria-hidden />

      <section dir="rtl" className="bg-latte px-6 py-8 md:py-12">
        <h2 className="font-farsi-display text-espresso mb-5 text-center text-lg md:mb-8 md:text-2xl">
          دسته‌بندی فروشگاه
        </h2>

        <div className="mx-auto flex max-w-md justify-center gap-6 md:max-w-none md:gap-14">
          {SHOP_CATEGORIES.map((item) => (
            <Link
              key={item.category}
              href={`/shop?category=${item.category}`}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="border-gold/30 bg-gold/10 hover:bg-gold/20 flex h-14 w-14 items-center justify-center rounded-full border transition md:h-20 md:w-20">
                <item.icon className="text-gold h-6 w-6 md:h-8 md:w-8" strokeWidth={1.5} />
              </span>
              <span className="font-farsi text-espresso text-xs font-semibold md:text-sm">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="divider-ornate" aria-hidden />

      <section dir="rtl" className="bg-parchment border-gold/15 border-b px-4 py-6 md:py-10">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-x-2 gap-y-5 md:max-w-4xl md:grid-cols-5 md:gap-x-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center gap-1.5 text-center">
              <feature.icon className="text-gold h-6 w-6 md:h-8 md:w-8" strokeWidth={1.5} />
              <span className="font-farsi text-espresso text-[11px] leading-4 font-bold md:text-sm">
                {feature.title}
              </span>
              <span className="font-farsi text-clay text-[10px] leading-4 md:text-xs">
                {feature.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {featuredItems.length > 0 && (
        <section dir="rtl" className="bg-latte px-6 py-10 md:py-16">
          <h2 className="font-farsi-display text-espresso mb-5 text-center text-xl md:mb-8 md:text-3xl">
            ویژه‌های کافه
          </h2>

          <div className="mx-auto grid max-w-md grid-cols-3 gap-3 md:max-w-2xl md:gap-6">
            {featuredItems.map((item) => (
              <Link
                key={item.id}
                href="/menu"
                className="border-gold/20 flex flex-col items-center gap-2 rounded-2xl border bg-white p-3 text-center shadow-sm transition hover:shadow-md md:gap-3 md:p-5"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-full md:h-24 md:w-24">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 768px) 96px, 64px"
                    className="object-cover"
                  />
                </div>

                <span className="font-farsi text-espresso text-xs leading-5 font-semibold md:text-base">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="h-16 md:hidden" aria-hidden />
    </div>
  );
}
