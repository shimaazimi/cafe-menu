import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, ReceiptText, XCircle } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatToman, toPersianDigits } from "@/lib/price";

export const dynamic = "force-dynamic";

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const rawOrder = Array.isArray(params.order) ? params.order[0] : params.order;
  const orderId = Number(rawOrder);
  if (!Number.isInteger(orderId)) notFound();

  const order = await prisma.order.findFirst({ where: { id: orderId, userId: user.id } });
  if (!order) notFound();

  const succeeded = order.paymentStatus === "paid";
  return (
    <main dir="rtl" className="bg-latte flex min-h-screen items-center justify-center px-5 py-12">
      <div className="border-gold/20 w-full max-w-lg rounded-[2rem] border bg-white p-7 text-center shadow-sm md:p-10">
        <span
          className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${succeeded ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
        >
          {succeeded ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
        </span>
        <h1 className="font-farsi-display text-espresso mt-5 text-3xl">
          {succeeded ? "پرداخت با موفقیت انجام شد" : "پرداخت ناموفق بود"}
        </h1>
        <p className="font-farsi text-clay mt-3 leading-7">
          {succeeded
            ? "سفارش شما ثبت شد و برای بررسی فروشگاه ارسال شده است."
            : "سفارش شما حفظ شده و می‌توانید دوباره پرداخت را امتحان کنید."}
        </p>
        <div className="bg-parchment font-farsi text-clay mt-6 rounded-2xl p-4 text-sm">
          <div className="flex justify-between">
            <span>شماره سفارش</span>
            <strong className="text-espresso">{toPersianDigits(order.id)}</strong>
          </div>
          <div className="mt-2 flex justify-between">
            <span>مبلغ</span>
            <strong className="text-espresso">{formatToman(order.totalToman)}</strong>
          </div>
          {succeeded && order.paymentReference && (
            <div className="mt-2 flex justify-between gap-3">
              <span>کد پیگیری آزمایشی</span>
              <strong dir="ltr" className="text-espresso break-all">
                {order.paymentReference}
              </strong>
            </div>
          )}
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {succeeded ? (
            <>
              <Link
                href="/profile"
                className="font-farsi bg-gold text-ink inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
              >
                <ReceiptText className="h-4 w-4" /> پیگیری سفارش
              </Link>
              <Link
                href="/shop"
                className="font-farsi border-gold/30 text-espresso rounded-full border px-6 py-3 text-sm font-bold"
              >
                بازگشت به فروشگاه
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/checkout/payment?order=${order.id}`}
                className="font-farsi bg-gold text-ink rounded-full px-6 py-3 text-sm font-bold"
              >
                تلاش مجدد
              </Link>
              <Link
                href="/cart"
                className="font-farsi border-gold/30 text-espresso rounded-full border px-6 py-3 text-sm font-bold"
              >
                بازگشت به سبد
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
