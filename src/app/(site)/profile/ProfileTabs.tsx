"use client";

import { useState } from "react";
import { RotateCcw, Coffee, MapPin, User } from "lucide-react";

import { toPersianDigits } from "@/lib/price";
import { orderStatusLabel } from "@/lib/orderStatus";
import { paymentStatusLabel } from "@/lib/checkout";

const TABS = [
  { id: "purchases", label: "خریدهای من" },
  { id: "active", label: "سفارش‌های فعال" },
  { id: "addresses", label: "آدرس‌ها" },
  { id: "edit", label: "ویرایش پروفایل" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface OrderView {
  id: number;
  status: string;
  paymentStatus: string;
  totalFormatted: string;
  dateFormatted: string;
  address: string | null;
  items: { nameFa: string; quantity: number }[];
}

function orderSummary(order: OrderView) {
  return order.items
    .map((item) => `${toPersianDigits(item.quantity)} عدد ${item.nameFa}`)
    .join("، ");
}

export default function ProfileTabs({
  name,
  phone,
  orders,
}: {
  name: string;
  phone: string;
  orders: OrderView[];
}) {
  const [tab, setTab] = useState<TabId>("purchases");

  const activeOrders = orders.filter((o) =>
    ["awaiting_payment", "pending", "preparing"].includes(o.status),
  );
  const pastOrders = orders.filter((o) => o.status === "completed" || o.status === "cancelled");
  const addresses = Array.from(
    new Set(orders.map((order) => order.address).filter(Boolean)),
  ) as string[];

  return (
    <div dir="rtl">
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto px-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`font-farsi shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              tab === t.id
                ? "bg-espresso text-latte border-espresso"
                : "border-gold/25 text-espresso/70 bg-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "purchases" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {pastOrders.length === 0 && (
            <p className="font-farsi text-clay text-sm">هنوز خریدی ثبت نشده است.</p>
          )}

          {pastOrders.map((order) => (
            <div
              key={order.id}
              className="border-gold/20 rounded-2xl border bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-farsi text-espresso text-sm font-bold">
                  سفارش {toPersianDigits(order.id)}
                </span>
                <span className="font-farsi text-clay text-xs">{order.dateFormatted}</span>
              </div>

              <p className="font-farsi text-clay mt-1 text-sm">{orderSummary(order)}</p>
              <p className="font-farsi text-clay mt-1 text-xs">
                پرداخت: {paymentStatusLabel(order.paymentStatus)}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-espresso text-sm font-bold">{order.totalFormatted}</span>

                <div className="flex gap-2">
                  <span
                    className={`font-farsi rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      order.status === "cancelled"
                        ? "border-red-200 text-red-600"
                        : "border-espresso/20 text-espresso"
                    }`}
                  >
                    {orderStatusLabel(order.status)}
                  </span>

                  <button className="font-farsi bg-gold text-ink flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold">
                    <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
                    سفارش مجدد
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "active" && (
        <div className="flex flex-col gap-3">
          {activeOrders.length === 0 && (
            <p className="font-farsi text-clay text-sm">سفارش فعالی وجود ندارد.</p>
          )}

          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="border-gold/20 flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm"
            >
              <div className="bg-gold/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                <Coffee className="text-gold h-5 w-5" strokeWidth={1.5} />
              </div>

              <div>
                <p className="font-farsi text-espresso text-sm font-bold">
                  سفارش {toPersianDigits(order.id)}
                </p>
                <p className="font-farsi text-clay text-xs">
                  وضعیت: {orderStatusLabel(order.status)} · {orderSummary(order)}
                </p>
                <p className="font-farsi text-clay mt-1 text-xs">
                  پرداخت: {paymentStatusLabel(order.paymentStatus)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "addresses" && (
        <div className="flex flex-col gap-3">
          {addresses.length === 0 && (
            <p className="font-farsi text-clay text-sm">
              هنوز نشانی‌ای در سفارش‌های شما ثبت نشده است.
            </p>
          )}
          {addresses.map((address, index) => (
            <div
              key={address}
              className="border-gold/20 flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-sm"
            >
              <MapPin className="text-gold mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />

              <div>
                <p className="font-farsi text-espresso text-sm font-bold">
                  نشانی {toPersianDigits(index + 1)}
                </p>
                <p className="font-farsi text-clay text-xs">{address}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "edit" && (
        <div className="border-gold/20 flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <User className="text-gold h-4 w-4" strokeWidth={1.5} />
            <span className="font-farsi text-espresso text-sm">{name}</span>
          </div>

          <div className="border-espresso/10 flex items-center gap-3 border-t pt-4">
            <span className="font-farsi text-clay text-sm" dir="ltr">
              {phone}
            </span>
          </div>

          <p className="font-farsi text-clay text-xs">
            ویرایش اطلاعات پروفایل به‌زودی فعال می‌شود.
          </p>
        </div>
      )}
    </div>
  );
}
