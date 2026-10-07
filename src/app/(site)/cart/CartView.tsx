"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Coffee, MapPin, Minus, Plus, Trash2, Truck } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { formatToman } from "@/lib/price";
import { createOrder } from "@/app/actions/orders";
import { toast } from "@/lib/toastStore";
import { formatPackageWeight } from "@/lib/productPackages";
import { getShippingCost, SHIPPING_METHODS } from "@/lib/checkout";

const inputClass =
  "font-farsi border-espresso/15 text-espresso focus:border-gold w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition";

interface Props {
  isLoggedIn: boolean;
  defaultName: string;
  defaultPhone: string;
}

export default function CartView({ isLoggedIn, defaultName, defaultPhone }: Props) {
  const router = useRouter();
  const { lines, totalPrice, add, remove, setQuantity } = useCart();
  const [shippingMethod, setShippingMethod] = useState<keyof typeof SHIPPING_METHODS>("standard");
  const [isPending, startTransition] = useTransition();
  const shippingCost = getShippingCost(shippingMethod);
  const payableTotal = totalPrice + shippingCost;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoggedIn) {
      toast.info("برای ادامه خرید ابتدا وارد حساب کاربری خود شوید");
      router.push(`/login?next=${encodeURIComponent("/cart")}`);
      return;
    }

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      try {
        const order = await createOrder(
          lines.map((line) => ({
            itemId: line.item.id,
            productSlug: line.item.productSlug,
            weightGrams: line.item.weightGrams,
            grindOption: line.item.grindOption,
            quantity: line.quantity,
          })),
          {
            recipientName: String(formData.get("recipientName") ?? ""),
            recipientPhone: String(formData.get("recipientPhone") ?? ""),
            province: String(formData.get("province") ?? ""),
            city: String(formData.get("city") ?? ""),
            postalAddress: String(formData.get("postalAddress") ?? ""),
            postalCode: String(formData.get("postalCode") ?? ""),
            shippingMethod,
            note: String(formData.get("note") ?? ""),
          },
        );

        router.push(`/checkout/payment?order=${order.id}`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "ثبت سفارش با خطا مواجه شد");
      }
    });
  };

  return (
    <main dir="rtl" className="bg-latte min-h-screen px-5 pt-8 pb-36 md:px-8 md:pb-20 lg:px-12">
      <div className="mx-auto flex max-w-md items-center gap-3 md:max-w-6xl">
        <Link
          href="/shop"
          aria-label="بازگشت به فروشگاه"
          className="text-espresso flex h-9 w-9 items-center justify-center"
        >
          <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
        </Link>
        <div>
          <h1 className="font-farsi-display text-espresso text-2xl">تکمیل خرید</h1>
          <p className="font-farsi text-clay mt-1 text-xs">سبد، نشانی و پرداخت در یک مسیر کوتاه</p>
        </div>
      </div>

      {lines.length === 0 ? (
        <div className="mx-auto mt-16 max-w-md text-center">
          <p className="font-farsi text-clay">سبد خرید شما خالی است.</p>
          <Link
            href="/shop"
            className="font-farsi bg-gold text-ink mt-5 inline-flex rounded-full px-6 py-3 text-sm font-bold"
          >
            رفتن به فروشگاه
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-7 grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px] lg:items-start"
        >
          <div className="space-y-6">
            <section className="border-gold/15 rounded-3xl border bg-white p-5 shadow-sm md:p-7">
              <h2 className="font-farsi-display text-espresso text-xl">محصولات سبد</h2>
              <ul className="divide-gold/15 mt-3 divide-y">
                {lines.map((line) => (
                  <li key={line.item.id} className="flex items-center gap-3 py-4 md:gap-4">
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

                    <div className="min-w-0 flex-1">
                      <h3 className="font-farsi text-espresso truncate font-semibold md:text-lg">
                        {line.item.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {line.item.weightGrams && (
                          <span className="bg-parchment text-gold rounded-full px-2 py-0.5 text-[10px] font-bold">
                            {formatPackageWeight(line.item.weightGrams)}
                          </span>
                        )}
                        {line.item.grindOption && (
                          <span className="bg-parchment text-clay rounded-full px-2 py-0.5 text-[10px] font-bold">
                            {line.item.grindOption}
                          </span>
                        )}
                      </div>
                      <p className="font-farsi text-clay mt-1 text-sm">
                        {formatToman(line.lineTotal)}
                      </p>
                    </div>

                    <div className="bg-espresso text-latte flex shrink-0 items-center gap-2 rounded-full px-1.5 py-1">
                      <button
                        type="button"
                        onClick={() => add(line.item)}
                        aria-label="افزایش تعداد"
                        className="p-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-4 text-center text-sm font-semibold">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(line.item.id)}
                        aria-label="کاهش تعداد"
                        className="p-1"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setQuantity(line.item.id, 0)}
                      aria-label="حذف از سبد خرید"
                      className="text-clay hidden h-9 w-9 items-center justify-center sm:flex"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-gold/15 rounded-3xl border bg-white p-5 shadow-sm md:p-7">
              <div className="flex items-center gap-2">
                <MapPin className="text-gold h-5 w-5" />
                <h2 className="font-farsi-display text-espresso text-xl">اطلاعات تحویل</h2>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <input
                  name="recipientName"
                  placeholder="نام و نام خانوادگی تحویل‌گیرنده"
                  defaultValue={defaultName}
                  required
                  minLength={2}
                  className={inputClass}
                />
                <input
                  name="recipientPhone"
                  type="tel"
                  inputMode="tel"
                  placeholder="شماره موبایل"
                  defaultValue={defaultPhone}
                  required
                  className={inputClass}
                />
                <input name="province" placeholder="استان" required className={inputClass} />
                <input name="city" placeholder="شهر" required className={inputClass} />
                <textarea
                  name="postalAddress"
                  placeholder="نشانی کامل، خیابان، کوچه، پلاک و واحد"
                  required
                  minLength={10}
                  rows={3}
                  className={`${inputClass} sm:col-span-2`}
                />
                <input
                  name="postalCode"
                  inputMode="numeric"
                  placeholder="کد پستی (اختیاری)"
                  className={inputClass}
                />
                <textarea
                  name="note"
                  placeholder="توضیحات سفارش یا زمان مناسب تحویل (اختیاری)"
                  rows={2}
                  className={`${inputClass} sm:col-span-2`}
                />
              </div>
            </section>

            <section className="border-gold/15 rounded-3xl border bg-white p-5 shadow-sm md:p-7">
              <div className="flex items-center gap-2">
                <Truck className="text-gold h-5 w-5" />
                <h2 className="font-farsi-display text-espresso text-xl">روش ارسال</h2>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {Object.entries(SHIPPING_METHODS).map(([value, option]) => (
                  <label
                    key={value}
                    className={`font-farsi flex cursor-pointer items-center justify-between rounded-2xl border p-4 text-sm transition ${shippingMethod === value ? "border-gold bg-parchment" : "border-gold/15"}`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={value}
                        checked={shippingMethod === value}
                        onChange={() => setShippingMethod(value as keyof typeof SHIPPING_METHODS)}
                      />
                      {option.label}
                    </span>
                    <strong className="text-espresso">
                      {option.costToman ? formatToman(option.costToman) : "رایگان"}
                    </strong>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside className="border-gold/20 rounded-3xl border bg-white p-5 shadow-sm lg:sticky lg:top-28">
            <h2 className="font-farsi-display text-espresso text-xl">خلاصه پرداخت</h2>
            <div className="font-farsi text-clay mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>جمع محصولات</span>
                <span>{formatToman(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>هزینه ارسال</span>
                <span>{shippingCost ? formatToman(shippingCost) : "رایگان"}</span>
              </div>
              <div className="border-gold/15 text-espresso flex justify-between border-t pt-4 text-base font-black">
                <span>مبلغ قابل پرداخت</span>
                <span>{formatToman(payableTotal)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="font-farsi bg-gold text-ink hover:bg-gold-light mt-6 hidden w-full rounded-full px-6 py-3.5 text-sm font-bold transition disabled:opacity-60 lg:block"
            >
              {isPending ? "در حال ساخت سفارش..." : "ادامه و پرداخت"}
            </button>
            {!isLoggedIn && (
              <p className="font-farsi mt-3 text-center text-xs text-amber-700">
                در مرحله بعد وارد حساب می‌شوید.
              </p>
            )}
          </aside>

          <div className="border-gold/20 fixed inset-x-0 bottom-0 z-30 border-t bg-white/95 px-5 py-3 backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-md items-center justify-between gap-4">
              <div>
                <span className="font-farsi text-clay block text-[10px]">مبلغ قابل پرداخت</span>
                <strong className="font-farsi text-espresso text-sm">
                  {formatToman(payableTotal)}
                </strong>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="font-farsi bg-gold text-ink rounded-full px-6 py-3 text-sm font-bold disabled:opacity-60"
              >
                {isPending ? "در حال ثبت..." : "ادامه و پرداخت"}
              </button>
            </div>
          </div>
        </form>
      )}
    </main>
  );
}
