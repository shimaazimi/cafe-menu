import { notFound, redirect } from "next/navigation";
import { CreditCard, LockKeyhole } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatToman, toPersianDigits } from "@/lib/price";
import MockPaymentPanel from "./MockPaymentPanel";

export const dynamic = "force-dynamic";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/checkout/payment")}`);

  const params = await searchParams;
  const rawOrder = Array.isArray(params.order) ? params.order[0] : params.order;
  const orderId = Number(rawOrder);
  if (!Number.isInteger(orderId)) notFound();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: user.id },
    include: { items: true },
  });
  if (!order) notFound();
  if (order.paymentStatus === "paid") redirect(`/checkout/result?order=${order.id}`);

  return (
    <main dir="rtl" className="bg-latte min-h-screen px-5 py-10 pb-28 md:px-8 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <span className="bg-gold/15 text-gold inline-flex h-14 w-14 items-center justify-center rounded-full">
            <CreditCard className="h-7 w-7" />
          </span>
          <h1 className="font-farsi-display text-espresso mt-4 text-3xl">درگاه پرداخت آزمایشی</h1>
          <p className="font-farsi text-clay mt-2 text-sm">
            هیچ مبلغ واقعی از حساب شما کم نمی‌شود.
          </p>
        </div>

        <div className="border-gold/20 mt-7 overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="bg-ink text-latte flex items-center justify-between px-5 py-4 md:px-7">
            <span className="font-farsi text-sm">سفارش {toPersianDigits(order.id)}</span>
            <span className="font-farsi text-gold-light font-black">
              {formatToman(order.totalToman)}
            </span>
          </div>
          <div className="p-5 md:p-7">
            <ul className="divide-gold/10 divide-y">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="font-farsi flex items-start justify-between gap-4 py-3 text-sm"
                >
                  <div>
                    <span className="text-espresso">
                      {toPersianDigits(item.quantity)}× {item.nameFa}
                    </span>
                    {item.grindOption && (
                      <span className="text-clay mt-1 block text-xs">
                        آسیاب: {item.grindOption}
                      </span>
                    )}
                  </div>
                  <span className="text-clay shrink-0">
                    {formatToman(item.unitPriceToman * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="font-farsi text-clay border-gold/15 mt-4 space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span>جمع محصولات</span>
                <span>{formatToman(order.subtotalToman)}</span>
              </div>
              <div className="flex justify-between">
                <span>هزینه ارسال</span>
                <span>
                  {order.shippingCostToman ? formatToman(order.shippingCostToman) : "رایگان"}
                </span>
              </div>
            </div>

            <MockPaymentPanel orderId={order.id} />

            <p className="font-farsi text-clay mt-5 flex items-center justify-center gap-2 text-center text-xs">
              <LockKeyhole className="h-3.5 w-3.5" /> این صفحه صرفاً برای تست جریان خرید است.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
