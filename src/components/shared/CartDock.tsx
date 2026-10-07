"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Coffee, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { formatToman } from "@/lib/price";

export default function CartDock() {
  const pathname = usePathname();
  const { lines, totalItems, totalPrice, add, remove, setQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const drawerOpen = isOpen && totalItems > 0;

  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [drawerOpen]);

  if (pathname === "/cart" || pathname.startsWith("/checkout") || totalItems === 0) return null;

  return (
    <>
      <div className="cart-dock-enter fixed inset-x-3 bottom-[4.75rem] z-30 mx-auto max-w-2xl md:bottom-6">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-ink text-latte border-gold/30 flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 shadow-[0_16px_50px_rgba(33,23,18,0.28)] transition hover:-translate-y-0.5 md:rounded-full md:px-6"
          aria-label={`نمایش سبد خرید با ${totalItems} کالا`}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="bg-gold text-ink relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <ShoppingBag className="h-5 w-5" />
              <span className="bg-latte text-ink absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black">
                {totalItems}
              </span>
            </span>
            <span className="min-w-0 text-right">
              <span className="font-farsi block text-sm font-bold">سبد خرید شما</span>
              <span className="font-farsi text-latte/60 block truncate text-[11px]">
                {totalItems} کالا آماده ثبت سفارش
              </span>
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-3">
            <span className="font-farsi text-gold-light text-sm font-black">
              {formatToman(totalPrice)}
            </span>
            <span className="bg-gold text-ink hidden items-center gap-1 rounded-full px-4 py-2 text-xs font-bold sm:flex">
              مشاهده <ArrowLeft className="h-3.5 w-3.5" />
            </span>
          </span>
        </button>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50" role="presentation">
          <button
            type="button"
            className="cart-backdrop-enter absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
            aria-label="بستن سبد خرید"
          />

          <aside
            dir="rtl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            className="cart-drawer-enter absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <header className="border-gold/15 flex items-center justify-between border-b px-5 py-5">
              <div>
                <h2 id="cart-drawer-title" className="font-farsi-display text-espresso text-2xl">
                  سبد خرید
                </h2>
                <p className="font-farsi text-clay mt-1 text-xs">{totalItems} کالا در سبد شماست</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-latte text-espresso flex h-10 w-10 items-center justify-center rounded-full"
                aria-label="بستن"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5">
              <ul className="divide-gold/15 divide-y">
                {lines.map((line) => (
                  <li key={line.item.id} className="flex gap-3 py-5">
                    <div className="bg-parchment relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl">
                      {line.item.image ? (
                        <Image
                          src={line.item.image}
                          alt={line.item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <Coffee className="text-gold h-7 w-7" strokeWidth={1.5} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/shop/${line.item.productSlug ?? line.item.id.split("::")[0]}`}
                        onClick={() => setIsOpen(false)}
                        className="font-farsi text-espresso line-clamp-2 text-sm leading-6 font-bold"
                      >
                        {line.item.name}
                      </Link>
                      <p className="font-farsi text-clay mt-1 text-xs">
                        {formatToman(line.lineTotal)}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="border-gold/20 flex items-center rounded-full border">
                          <button
                            type="button"
                            onClick={() => add(line.item)}
                            className="text-espresso flex h-8 w-8 items-center justify-center"
                            aria-label={`افزایش ${line.item.name}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-xs font-bold">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => remove(line.item.id)}
                            className="text-espresso flex h-8 w-8 items-center justify-center"
                            aria-label={`کاهش ${line.item.name}`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setQuantity(line.item.id, 0)}
                          className="text-clay p-2 transition hover:text-red-600"
                          aria-label={`حذف ${line.item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-gold/15 bg-latte/60 border-t p-5">
              <div className="font-farsi mb-4 flex items-center justify-between">
                <span className="text-clay text-sm">مبلغ کل</span>
                <span className="text-espresso text-lg font-black">{formatToman(totalPrice)}</span>
              </div>
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="font-farsi bg-gold text-ink hover:bg-gold-light flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-black transition"
              >
                ادامه و ثبت سفارش <ArrowLeft className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-farsi text-clay mt-3 w-full py-2 text-xs font-bold"
              >
                ادامه خرید
              </button>
            </footer>
          </aside>
        </div>
      )}
    </>
  );
}
