import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Bean, HeartHandshake, MapPin, PackageCheck } from "lucide-react";

import BrandMark from "@/components/shared/BrandMark";
import { siteInfo } from "@/data/site";

export const metadata: Metadata = {
  title: "درباره ما",
  description: `داستان ${siteInfo.name}، شیوه انتخاب قهوه و نشانی فروشگاه در بازار بزرگ تهران.`,
};

const values = [
  {
    icon: Bean,
    title: "انتخاب روشن",
    text: "مشخصات هر قهوه را ساده و کاربردی توضیح می‌دهیم تا خرید به حدس‌زدن وابسته نباشد.",
  },
  {
    icon: PackageCheck,
    title: "آماده‌سازی دقیق",
    text: "وزن و نوع آسیاب هر سفارش همان‌طور که مشتری انتخاب کرده ثبت و برای آماده‌سازی ارسال می‌شود.",
  },
  {
    icon: HeartHandshake,
    title: "همراه خانه و کسب‌وکار",
    text: "از مصرف روزانه خانه تا سفارش‌های محل کار و همکاری با کافه‌ها، مسیر مناسب هر مشتری را جدا می‌بینیم.",
  },
];

export default function AboutPage() {
  return (
    <main dir="rtl" className="bg-latte min-h-screen">
      <section className="bg-ink px-6 py-12 text-center md:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <BrandMark size={56} />
          <span className="font-farsi text-gold mt-5 text-sm font-bold">
            از سال {siteInfo.establishedYear}
          </span>
          <h1 className="font-farsi-display text-gold-light mt-2 text-4xl md:text-6xl">
            درباره {siteInfo.name}
          </h1>
          <p className="font-farsi text-latte/65 mt-5 max-w-2xl leading-8 md:text-lg md:leading-9">
            ما از قلب بازار بزرگ تهران قهوه را با زبان ساده به مشتری معرفی می‌کنیم؛ محصولی که با روش
            دم‌آوری، ذائقه و مصرف واقعی شما هماهنگ باشد.
          </p>
        </div>
      </section>
      <div className="divider-ornate" aria-hidden />

      <section className="px-6 py-12 md:px-10 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className="border-gold/15 rounded-3xl border bg-white p-6 shadow-sm"
              >
                <span className="bg-parchment text-gold flex h-12 w-12 items-center justify-center rounded-2xl">
                  <value.icon className="h-6 w-6" />
                </span>
                <h2 className="font-farsi-display text-espresso mt-5 text-2xl">{value.title}</h2>
                <p className="font-farsi text-clay mt-2 text-sm leading-7">{value.text}</p>
              </article>
            ))}
          </div>

          <div className="bg-espresso mt-8 grid gap-6 rounded-[2rem] p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div>
              <p className="font-farsi text-gold-light flex items-center gap-2 text-sm font-bold">
                <MapPin className="h-4 w-4" />
                نشانی فروشگاه
              </p>
              <p className="font-farsi text-latte mt-3 leading-8">{siteInfo.addressFa}</p>
            </div>
            <Link
              href="/shop"
              className="font-farsi bg-gold text-ink inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
            >
              مشاهده محصولات <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
