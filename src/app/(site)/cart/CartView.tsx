"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Coffee, Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { formatToman, parseTomanPrice } from "@/lib/price";
import { createOrder } from "@/app/actions/orders";
import { toast } from "@/lib/toastStore";

export default function CartView({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lines, totalPrice, add, remove, setQuantity, clear } = useCart();
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [confirmedOrderId, setConfirmedOrderId] = useState<number | null>(null);
  const autoSubmitted = useRef(false);

  const submitOrder = () => {
    startTransition(async () => {
      try {
        const order = await createOrder(
          lines.map((line) => ({
            itemId: line.item.id,
            nameFa: line.item.name,
            unitPriceToman: parseTomanPrice(line.item.price),
            quantity: line.quantity,
          })),
          note || undefined,
        );

        setConfirmedOrderId(order.id);
        clear();
      } catch {
        toast.error("ثبت سفارش با خطا مواجه شد. دوباره تلاش کنید.");
      }
    });
  };

  const handleSubmit = () => {
    if (!isLoggedIn) {
      toast.info("برای ثبت سفارش ابتدا وارد حساب کاربری خود شوید");
      router.push(`/login?next=${encodeURIComponent("/cart?autoSubmit=1")}`);
      return;
    }

    submitOrder();
  };

  useEffect(() => {
    if (
      isLoggedIn &&
      searchParams.get("autoSubmit") === "1" &&
      !autoSubmitted.current &&
      lines.length > 0
    ) {
      autoSubmitted.current = true;
      router.replace("/cart");
      submitOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, searchParams, lines.length]);

  if (confirmedOrderId !== null) {
    return (
      <main
        dir="rtl"
        className="bg-latte flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center"
      >
        <p className="font-farsi-display text-espresso text-2xl">سفارش شما ثبت شد</p>

        <p className="font-farsi text-clay">شماره سفارش: {confirmedOrderId}</p>

        <Link
          href="/menu"
          className="font-farsi bg-gold text-ink mt-4 rounded-full px-6 py-3 text-sm font-bold"
        >
          بازگشت به منو
        </Link>
      </main>
    );
  }

  return (
    <main dir="rtl" className="bg-latte min-h-screen px-6 pt-8 pb-32 md:px-8 md:pb-16 lg:px-12">
      <div className="mx-auto flex max-w-md items-center gap-3 md:max-w-5xl">
        <Link
          href="/menu"
          aria-label="بازگشت به منو"
          className="text-espresso flex h-9 w-9 items-center justify-center"
        >
          <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
        </Link>

        <h1 className="font-farsi-display text-espresso text-xl md:text-2xl">سبد خرید</h1>
      </div>

      {lines.length === 0 ? (
        <p className="font-farsi text-clay mt-16 text-center">سبد خرید شما خالی است.</p>
      ) : (
        <div className="mx-auto mt-6 max-w-md md:grid md:max-w-5xl md:grid-cols-[1fr_320px] md:items-start md:gap-8">
          <div>
            <ul className="divide-gold/15 divide-y">
              {lines.map((line) => (
                <li key={line.item.id} className="flex items-center gap-4 py-4">
                  <div className="bg-latte relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl md:h-20 md:w-20">
                    {line.item.image ? (
                      <Image
                        src={line.item.image}
                        alt={line.item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <Coffee className="text-espresso/40 h-6 w-6" strokeWidth={1.5} />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-farsi text-espresso font-semibold md:text-lg">
                      {line.item.name}
                    </h3>

                    <p className="font-farsi text-clay text-sm">{formatToman(line.lineTotal)}</p>
                  </div>

                  <div className="bg-espresso text-latte flex shrink-0 items-center gap-3 rounded-full px-2 py-1">
                    <button
                      onClick={() => add(line.item)}
                      aria-label="افزایش تعداد"
                      className="flex h-6 w-6 items-center justify-center"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>

                    <span className="min-w-4 text-center text-sm font-semibold">
                      {line.quantity}
                    </span>

                    <button
                      onClick={() => remove(line.item.id)}
                      aria-label="کاهش تعداد"
                      className="flex h-6 w-6 items-center justify-center"
                    >
                      <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  </div>

                  <button
                    onClick={() => setQuantity(line.item.id, 0)}
                    aria-label="حذف از سبد خرید"
                    className="text-clay flex h-9 w-9 items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </li>
              ))}
            </ul>

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="توضیحات سفارش (اختیاری)"
              rows={2}
              className="font-farsi border-espresso/15 text-espresso focus:border-gold mt-4 w-full rounded-lg border bg-white px-4 py-3 text-sm transition outline-none"
            />
          </div>

          <div className="border-gold/20 hidden rounded-2xl border bg-white p-5 shadow-sm md:sticky md:top-28 md:block">
            <h2 className="font-farsi-display text-espresso text-lg">خلاصه سفارش</h2>

            <div className="border-gold/15 mt-4 flex items-center justify-between border-t pt-4">
              <span className="font-farsi text-clay text-sm">مبلغ کل</span>
              <span className="font-farsi text-espresso text-lg font-bold">
                {formatToman(totalPrice)}
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="font-farsi bg-gold text-ink hover:bg-gold-light mt-5 w-full rounded-full px-6 py-3 text-sm font-bold transition disabled:opacity-60"
            >
              {isPending ? "در حال ثبت..." : "ثبت سفارش"}
            </button>
          </div>
        </div>
      )}

      {lines.length > 0 && (
        <div className="border-gold/20 fixed inset-x-0 bottom-0 border-t bg-white/95 px-6 py-4 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between">
            <span className="font-farsi text-espresso font-bold">{formatToman(totalPrice)}</span>

            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="font-farsi bg-gold text-ink rounded-full px-6 py-3 text-sm font-bold disabled:opacity-60"
            >
              {isPending ? "در حال ثبت..." : "ثبت سفارش"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
