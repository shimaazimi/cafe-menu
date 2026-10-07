"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Coffee, MapPin, Star, Trash2, User } from "lucide-react";

import { toPersianDigits } from "@/lib/price";
import { orderStatusLabel } from "@/lib/orderStatus";
import { paymentStatusLabel } from "@/lib/checkout";
import { deleteAddress, setDefaultAddress, updateProfileName } from "@/app/actions/profile";
import { toast } from "@/lib/toastStore";

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

interface AddressView {
  id: number;
  label: string;
  recipientName: string;
  recipientPhone: string;
  province: string;
  city: string;
  postalAddress: string;
  postalCode: string | null;
  isDefault: boolean;
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
  addresses,
}: {
  name: string;
  phone: string;
  orders: OrderView[];
  addresses: AddressView[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("purchases");
  const [profileName, setProfileName] = useState(name);
  const [isPending, startTransition] = useTransition();

  const activeOrders = orders.filter((o) =>
    ["awaiting_payment", "pending", "preparing"].includes(o.status),
  );
  const pastOrders = orders.filter((o) => o.status === "completed" || o.status === "cancelled");

  const runAddressAction = (action: () => Promise<void>, message: string) => {
    startTransition(async () => {
      try {
        await action();
        toast.success(message);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "انجام عملیات ممکن نشد");
      }
    });
  };

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
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border-gold/20 rounded-2xl border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <MapPin className="text-gold mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-farsi text-espresso text-sm font-bold">{address.label}</p>
                    {address.isDefault && (
                      <span className="font-farsi bg-gold/15 text-gold rounded-full px-2 py-0.5 text-[10px] font-bold">
                        پیش‌فرض
                      </span>
                    )}
                  </div>
                  <p className="font-farsi text-clay mt-1 text-xs leading-6">
                    {address.province}، {address.city}، {address.postalAddress}
                  </p>
                  <p className="font-farsi text-clay mt-1 text-xs">
                    تحویل‌گیرنده: {address.recipientName} · {address.recipientPhone}
                    {address.postalCode ? ` · کد پستی: ${address.postalCode}` : ""}
                  </p>
                </div>
              </div>
              <div className="border-gold/10 mt-3 flex gap-2 border-t pt-3">
                {!address.isDefault && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      runAddressAction(
                        () => setDefaultAddress(address.id),
                        "نشانی پیش‌فرض تغییر کرد",
                      )
                    }
                    className="font-farsi text-espresso border-gold/20 flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold disabled:opacity-50"
                  >
                    <Star className="h-3.5 w-3.5" /> پیش‌فرض شود
                  </button>
                )}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => runAddressAction(() => deleteAddress(address.id), "نشانی حذف شد")}
                  className="font-farsi flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-red-600 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "edit" && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              try {
                await updateProfileName(profileName);
                toast.success("اطلاعات پروفایل ذخیره شد");
                router.refresh();
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "ذخیره اطلاعات ممکن نشد");
              }
            });
          }}
          className="border-gold/20 flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm"
        >
          <label className="flex items-center gap-3">
            <User className="text-gold h-4 w-4" strokeWidth={1.5} />
            <input
              value={profileName}
              onChange={(event) => setProfileName(event.target.value)}
              required
              minLength={2}
              placeholder="نام و نام خانوادگی"
              className="font-farsi border-gold/20 text-espresso focus:border-gold w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
            />
          </label>

          <div className="border-espresso/10 flex items-center gap-3 border-t pt-4">
            <span className="font-farsi text-clay text-sm" dir="ltr">
              {phone}
            </span>
          </div>

          <p className="font-farsi text-clay text-xs">شماره موبایل شناسه ورود شماست.</p>
          <button
            type="submit"
            disabled={isPending}
            className="font-farsi bg-gold text-ink self-start rounded-full px-5 py-2.5 text-sm font-bold disabled:opacity-50"
          >
            {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </form>
      )}
    </div>
  );
}
