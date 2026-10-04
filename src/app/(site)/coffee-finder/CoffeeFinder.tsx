"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bean, RotateCcw, Sparkles } from "lucide-react";

import { formatToman } from "@/lib/price";

interface Product {
  slug: string;
  nameFa: string;
  description: string;
  priceToman: number;
  imageUrl: string | null;
  coffeeType: string | null;
  strength: number | null;
  bitterness: number | null;
  acidity: number | null;
  body: number | null;
  caffeineLevel: number | null;
  arabicaPercent: number | null;
  robustaPercent: number | null;
  productForm: string | null;
  catalogOnly: boolean;
  priceOnRequest: boolean;
  flavorNotes: string[];
  suitableFor: string[];
  brewMethods: string[];
}

const questions = [
  {
    key: "use",
    title: "قهوه را بیشتر کجا می‌خوری؟",
    options: [
      ["home", "خانه"],
      ["office", "محل کار"],
      ["cafe", "کافه"],
    ],
  },
  {
    key: "brew",
    title: "با چه روشی آماده‌اش می‌کنی؟",
    options: [
      ["espresso", "اسپرسوساز"],
      ["moka", "موکاپات"],
      ["french_press", "فرنچ‌پرس"],
      ["filter", "دمی"],
      ["turkish", "ترک"],
      ["instant", "فوری"],
    ],
  },
  {
    key: "taste",
    title: "چه طعمی را ترجیح می‌دهی؟",
    options: [
      ["strong", "تلخ و قوی"],
      ["balanced", "متعادل"],
      ["fruity", "میوه‌ای و اسیدی"],
    ],
  },
  {
    key: "caffeine",
    title: "چه مقدار کافئین می‌خواهی؟",
    options: [
      ["high", "زیاد و انرژی‌بخش"],
      ["medium", "متوسط"],
      ["low", "کمتر و ملایم‌تر"],
    ],
  },
] as const;

type Answers = { use?: string; brew?: string; taste?: string; caffeine?: string };

export default function CoffeeFinder({ products }: { products: Product[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const complete = step >= questions.length;

  const ranked = useMemo(() => {
    const targetStrength = answers.taste === "strong" ? 5 : answers.taste === "fruity" ? 2 : 3;
    const targetAcidity = answers.taste === "fruity" ? 5 : answers.taste === "strong" ? 1 : 3;
    const targetCaffeine = answers.caffeine === "high" ? 5 : answers.caffeine === "low" ? 2 : 3;
    return products
      .map((product) => {
        let score = 0;
        if (answers.use && product.suitableFor.includes(answers.use)) score += 4;
        if (answers.brew && product.brewMethods.includes(answers.brew)) score += 5;
        if (product.strength) score += Math.max(0, 4 - Math.abs(product.strength - targetStrength));
        if (product.acidity) score += Math.max(0, 3 - Math.abs(product.acidity - targetAcidity));
        if (product.caffeineLevel)
          score += Math.max(0, 4 - Math.abs(product.caffeineLevel - targetCaffeine));
        if (answers.taste === "strong" && product.body) score += product.body;
        if (answers.taste === "fruity" && product.flavorNotes.includes("fruity")) score += 3;
        if (answers.taste === "strong" && product.coffeeType === "robusta") score += 2;
        return { product, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [answers, products]);

  const choose = (key: keyof Answers, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setStep((current) => current + 1);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <div className="mx-auto mt-8 max-w-3xl">
      <div className="mb-4 flex justify-center gap-2" aria-label="مراحل انتخاب">
        {questions.map((question, index) => (
          <span
            key={question.key}
            className={`h-1.5 rounded-full transition-all ${
              index <= step ? "bg-gold w-12" : "bg-sand w-8"
            }`}
          />
        ))}
      </div>

      <section className="border-gold/15 overflow-hidden rounded-[2rem] border bg-white p-6 shadow-sm md:p-10">
        {!complete ? (
          <>
            <div className="flex items-center justify-between">
              <p className="font-farsi text-clay text-sm">
                سؤال {step + 1} از {questions.length}
              </p>
              {step > 0 && (
                <button
                  onClick={() => setStep((value) => value - 1)}
                  className="text-clay p-2"
                  aria-label="مرحله قبل"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>
            <h2 className="font-farsi-display text-espresso mt-3 text-center text-2xl">
              {questions[step].title}
            </h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {questions[step].options.map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => choose(questions[step].key, value)}
                  className="border-gold/20 font-farsi text-espresso hover:border-gold hover:bg-parchment rounded-2xl border px-5 py-5 font-bold transition"
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <Sparkles className="text-gold mx-auto h-8 w-8" />
              <h2 className="font-farsi-display text-espresso mt-3 text-2xl">پیشنهاد ما برای تو</h2>
              <p className="font-farsi text-clay mt-2 text-sm">
                بر اساس روش دم‌آوری و سلیقه‌ای که انتخاب کردی
              </p>
            </div>

            {ranked.length ? (
              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {ranked.map(({ product }, index) => (
                  <Link
                    key={product.slug}
                    href={`/shop/${product.slug}`}
                    className="border-gold/15 group rounded-2xl border p-3"
                  >
                    <div className="bg-parchment relative flex h-32 items-center justify-center overflow-hidden rounded-xl">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.nameFa}
                          fill
                          sizes="240px"
                          className="object-cover"
                        />
                      ) : (
                        <Bean className="text-gold h-10 w-10" />
                      )}
                      {index === 0 && (
                        <span className="bg-gold text-ink absolute top-2 right-2 rounded-full px-2 py-1 text-[10px] font-bold">
                          بهترین انتخاب
                        </span>
                      )}
                    </div>
                    <h3 className="font-farsi text-espresso mt-3 font-bold">{product.nameFa}</h3>
                    <p className="font-farsi text-clay mt-1 line-clamp-2 text-xs leading-5">
                      {product.description}
                    </p>
                    <span className="font-farsi text-espresso mt-3 flex items-center justify-between text-xs font-bold">
                      {product.priceOnRequest ? "استعلام قیمت" : formatToman(product.priceToman)}
                      <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="font-farsi text-clay mt-8 text-center">
                هنوز قهوه‌ای برای پیشنهاد ثبت نشده است.
              </p>
            )}

            <button
              onClick={reset}
              className="font-farsi text-clay mx-auto mt-7 flex items-center gap-2 text-sm"
            >
              <RotateCcw className="h-4 w-4" /> انتخاب دوباره
            </button>
          </>
        )}
      </section>
    </div>
  );
}
