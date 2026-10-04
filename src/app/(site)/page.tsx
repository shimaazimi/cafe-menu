import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bean, BriefcaseBusiness, Coffee, Gift, MapPin, Sparkles } from "lucide-react";

import { formatToman } from "@/lib/price";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const QUICK_PATHS = [
  {
    icon: Coffee,
    label: "قهوه روزانه",
    hint: "ساده، خوش‌قیمت و همیشه در دسترس",
    href: "/shop?category=beans",
  },
  { icon: Bean, label: "قهوه اسپرسو", hint: "برای کرما و انرژی بیشتر", href: "/coffee-finder" },
  {
    icon: BriefcaseBusiness,
    label: "برای محل کار",
    hint: "انتخاب اقتصادی برای مصرف روزمره",
    href: "/coffee-finder",
  },
  {
    icon: Gift,
    label: "هدیه و اکسسوری",
    hint: "ماگ و ابزارهای کاربردی",
    href: "/shop?category=mug",
  },
];

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { stockQuantity: { gt: 0 } },
    orderBy: { id: "asc" },
    take: 3,
  });

  return (
    <main dir="rtl" className="bg-latte min-h-screen overflow-hidden pb-20 md:pb-0">
      <section className="bg-ink relative isolate min-h-[610px] overflow-hidden px-5 py-12 md:min-h-[680px] md:px-10 md:py-20">
        <Image
          src="/images/hero.jpg"
          alt="فضای کافه فرندز در بازار تهران"
          fill
          priority
          className="-z-20 object-cover opacity-35"
        />
        <div className="from-ink via-ink/80 absolute inset-0 -z-10 bg-gradient-to-l to-transparent" />
        <div className="bg-arabesque absolute inset-0 -z-10 opacity-20" />
        <div className="mx-auto flex min-h-[500px] max-w-6xl items-center">
          <div className="max-w-2xl">
            <div className="border-gold/25 bg-ink/50 text-gold-light font-farsi inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs backdrop-blur">
              <MapPin className="h-3.5 w-3.5" /> از قلب بازار بزرگ تهران
            </div>
            <h1 className="font-farsi-display text-gold-light mt-6 text-4xl leading-[1.5] md:text-7xl md:leading-[1.35]">
              قهوه تازه برای
              <br />
              روزهای شلوغ بازار
            </h1>
            <p className="font-farsi text-latte/75 mt-5 max-w-xl text-base leading-8 md:text-xl md:leading-10">
              عربیکا، روبوستا و ترکیب‌های کاربردی برای خانه و محل کار؛ با توضیح ساده، قیمت منطقی و
              انتخاب راحت.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/coffee-finder"
                className="font-farsi bg-gold text-ink hover:bg-gold-light inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-bold transition"
              >
                <Sparkles className="h-4 w-4" /> قهوه مناسب من
              </Link>
              <Link
                href="/shop?category=beans"
                className="border-gold/35 text-gold-light font-farsi hover:bg-gold/10 inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 font-bold transition"
              >
                خرید قهوه <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="font-farsi text-gold text-sm font-bold">انتخاب سریع</span>
            <h2 className="font-farsi-display text-espresso mt-2 text-3xl md:text-4xl">
              چه چیزی می‌خواهی؟
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_PATHS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="border-gold/15 group rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="bg-parchment text-gold flex h-12 w-12 items-center justify-center rounded-2xl">
                  <item.icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="font-farsi text-espresso mt-4 font-bold">{item.label}</h3>
                <p className="font-farsi text-clay mt-1 text-xs leading-6">{item.hint}</p>
                <ArrowLeft className="text-gold mt-4 h-4 w-4 transition group-hover:-translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment px-5 py-12 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm md:grid-cols-[1fr_1.1fr] md:p-10">
          <div className="bg-ink relative min-h-72 overflow-hidden rounded-3xl p-7">
            <div className="bg-arabesque absolute inset-0 opacity-30" />
            <div className="relative flex h-full min-h-56 flex-col justify-between">
              <Sparkles className="text-gold h-10 w-10" />
              <div>
                <p className="font-farsi-display text-gold-light text-3xl">
                  سه سؤال، یک انتخاب بهتر
                </p>
                <p className="font-farsi text-latte/65 mt-2 text-sm leading-7">
                  بدون اصطلاحات پیچیده و بدون حدس زدن.
                </p>
              </div>
            </div>
          </div>
          <div>
            <span className="font-farsi text-gold text-sm font-bold">Coffee Finder</span>
            <h2 className="font-farsi-display text-espresso mt-2 text-3xl leading-relaxed md:text-4xl">
              نمی‌دانی کدام قهوه برای توست؟
            </h2>
            <p className="font-farsi text-clay mt-3 leading-8">
              بگو قهوه را کجا می‌خوری، با چه روشی درست می‌کنی و چه طعمی دوست داری. راهنما از بین
              محصولات موجود پیشنهاد می‌دهد.
            </p>
            <Link
              href="/coffee-finder"
              className="font-farsi bg-espresso text-latte mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
            >
              شروع انتخاب <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="px-5 py-12 md:px-10 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="font-farsi text-gold text-sm font-bold">پیشنهادهای امروز</span>
                <h2 className="font-farsi-display text-espresso mt-1 text-3xl">محصولات محبوب</h2>
              </div>
              <Link
                href="/shop"
                className="font-farsi text-espresso hidden items-center gap-2 text-sm font-bold sm:flex"
              >
                همه محصولات <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {featuredProducts.map((product) => (
                <Link
                  key={product.slug}
                  href={`/shop/${product.slug}`}
                  className="border-gold/15 flex items-center gap-4 rounded-3xl border bg-white p-4 shadow-sm"
                >
                  <div className="bg-parchment relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.nameFa}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <Bean className="text-gold h-8 w-8" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-farsi text-espresso leading-7 font-bold">
                      {product.nameFa}
                    </h3>
                    <p className="font-farsi text-clay mt-2 text-xs">
                      {formatToman(product.priceToman)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 pb-12 md:px-10 md:pb-20">
        <div className="bg-espresso mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-[2rem] p-7 md:flex-row md:items-center md:p-10">
          <div>
            <span className="font-farsi text-gold-light text-sm">برای کافه‌ها و کسب‌وکارها</span>
            <h2 className="font-farsi-display text-latte mt-2 text-3xl">
              قهوه برای مصرف روزانه مجموعه شما
            </h2>
            <p className="font-farsi text-latte/60 mt-2 text-sm">
              برای انتخاب محصول و شرایط همکاری با ما آشنا شوید.
            </p>
          </div>
          <Link
            href="/business"
            className="font-farsi bg-gold text-ink inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
          >
            مسیر همکاری <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
