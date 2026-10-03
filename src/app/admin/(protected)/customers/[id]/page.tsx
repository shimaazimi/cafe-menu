import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatToman, toPersianDigits } from "@/lib/price";
import { formatJalaliDate } from "@/lib/date";
import { orderStatusLabel } from "@/lib/orderStatus";

export const dynamic = "force-dynamic";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId)) notFound();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });

  if (!user) notFound();

  const totalSpent = user.orders.reduce((sum, order) => sum + order.totalToman, 0);

  return (
    <div dir="rtl">
      <Link
        href="/admin/customers"
        className="font-farsi text-clay mb-4 inline-flex items-center gap-1 text-sm"
      >
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        بازگشت به کاربران
      </Link>

      <h1 className="font-farsi-display text-espresso mb-5 text-xl">{user.name ?? "بدون نام"}</h1>

      <div className="mb-8 flex flex-wrap gap-8">
        <div>
          <div className="font-farsi text-clay text-xs">شماره موبایل</div>
          <div className="font-farsi text-espresso text-base font-bold" dir="ltr">
            {user.phone}
          </div>
        </div>
        <div>
          <div className="font-farsi text-clay text-xs">عضویت از</div>
          <div className="font-farsi text-espresso text-base font-bold">
            {formatJalaliDate(user.createdAt)}
          </div>
        </div>
        <div>
          <div className="font-farsi text-clay text-xs">تعداد سفارش</div>
          <div className="font-farsi text-espresso text-base font-bold">
            {toPersianDigits(user.orders.length)}
          </div>
        </div>
        <div>
          <div className="font-farsi text-clay text-xs">مجموع خرید</div>
          <div className="font-farsi text-espresso text-base font-bold">
            {formatToman(totalSpent)}
          </div>
        </div>
      </div>

      <h2 className="font-farsi-display text-espresso mb-3 text-lg">تاریخچه سفارش‌ها</h2>

      {user.orders.length === 0 ? (
        <p className="font-farsi text-clay">هنوز سفارشی ثبت نکرده است.</p>
      ) : (
        <div className="border-gold/20 overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full min-w-[600px] text-right">
            <thead>
              <tr className="border-gold/15 font-farsi text-clay border-b text-sm">
                <th className="px-4 py-3 font-semibold">شماره</th>
                <th className="px-4 py-3 font-semibold">اقلام</th>
                <th className="px-4 py-3 font-semibold">مبلغ</th>
                <th className="px-4 py-3 font-semibold">وضعیت</th>
                <th className="px-4 py-3 font-semibold">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {user.orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-gold/10 font-farsi border-b text-sm last:border-0"
                >
                  <td className="text-espresso px-4 py-3 font-bold">{toPersianDigits(order.id)}</td>
                  <td className="text-clay px-4 py-3">
                    {order.items
                      .map((item) => `${toPersianDigits(item.quantity)}× ${item.nameFa}`)
                      .join("، ")}
                  </td>
                  <td className="text-espresso px-4 py-3 whitespace-nowrap">
                    {formatToman(order.totalToman)}
                  </td>
                  <td className="text-espresso px-4 py-3">{orderStatusLabel(order.status)}</td>
                  <td className="text-clay px-4 py-3 whitespace-nowrap">
                    {formatJalaliDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
