import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Coffee,
  MapPin,
  MessagesSquare,
  PackageCheck,
} from "lucide-react";

import { siteInfo } from "@/data/site";

const steps = [
  {
    icon: MessagesSquare,
    title: "گفت‌وگوی کوتاه",
    text: "نوع مصرف، حجم تقریبی و بودجه شما را می‌پرسیم.",
  },
  {
    icon: Coffee,
    title: "پیشنهاد قهوه",
    text: "از بین محصولات فعلی، گزینه مناسب‌تر را معرفی می‌کنیم.",
  },
  {
    icon: PackageCheck,
    title: "شروع همکاری",
    text: "بعد از انتخاب، درباره موجودی و شرایط سفارش هماهنگ می‌کنیم.",
  },
];

export default function BusinessPage() {
  return (
    <main dir="rtl" className="bg-latte min-h-screen pb-24">
      <section className="bg-ink relative overflow-hidden px-5 py-16 text-center md:px-10 md:py-24">
        <div className="bg-arabesque absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-3xl">
          <span className="font-farsi text-gold-light text-sm font-bold">
            برای کافه‌ها، دفترها و فروشگاه‌ها
          </span>
          <h1 className="font-farsi-display text-latte mt-3 text-4xl leading-relaxed md:text-6xl">
            یک مسیر ساده برای خرید همکاری
          </h1>
          <p className="font-farsi text-latte/65 mx-auto mt-4 max-w-2xl leading-8">
            ما هنوز یک برنامه عمده‌فروشی بزرگ را ادعا نمی‌کنیم؛ اما برای سفارش‌های کاری، صادقانه
            نیاز شما را بررسی می‌کنیم و از محصولات موجود پیشنهاد می‌دهیم.
          </p>
        </div>
      </section>
      <section className="px-5 py-12 md:px-10 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-farsi-display text-espresso text-center text-3xl">
            همکاری چطور شروع می‌شود؟
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="border-gold/15 rounded-3xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-parchment text-gold flex h-12 w-12 items-center justify-center rounded-2xl">
                    <step.icon className="h-6 w-6" />
                  </span>
                  <span className="text-gold/50 text-3xl font-black">۰{index + 1}</span>
                </div>
                <h3 className="font-farsi text-espresso mt-5 font-bold">{step.title}</h3>
                <p className="font-farsi text-clay mt-2 text-sm leading-7">{step.text}</p>
              </div>
            ))}
          </div>
          <div className="bg-parchment mt-10 grid gap-8 rounded-[2rem] p-7 md:grid-cols-2 md:p-10">
            <div>
              <h2 className="font-farsi-display text-espresso text-3xl">مناسب چه کسانی است؟</h2>
              <ul className="mt-5 space-y-3">
                {[
                  "دفترها با مصرف روزانه قهوه",
                  "کافه‌های کوچک در شروع کار",
                  "فروشگاه‌هایی که محصول فعلی ما را می‌خواهند",
                ].map((item) => (
                  <li key={item} className="font-farsi text-clay flex items-center gap-3 text-sm">
                    <CheckCircle2 className="text-gold h-5 w-5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-ink rounded-3xl p-6">
              <MapPin className="text-gold h-7 w-7" />
              <h3 className="font-farsi-display text-gold-light mt-4 text-2xl">حضوری صحبت کنیم</h3>
              <p className="font-farsi text-latte/65 mt-2 text-sm leading-7">
                {siteInfo.addressFa}
              </p>
              <Link
                href="/coffee-finder"
                className="font-farsi bg-gold text-ink mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
              >
                اول قهوه مناسب را پیدا کن <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
