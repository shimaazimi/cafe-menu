import { prisma } from "@/lib/prisma";
import { formatToman, toPersianDigits } from "@/lib/price";
import { formatJalaliDate } from "@/lib/date";
import OrderStatusSelect from "./OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, user: { select: { name: true, phone: true } } },
  });

  return (
    <div dir="rtl">
      <h1 className="font-farsi-display text-espresso mb-5 text-xl">سفارش‌ها</h1>

      {orders.length === 0 ? (
        <p className="font-farsi text-clay">هنوز سفارشی ثبت نشده است.</p>
      ) : (
        <div className="border-gold/20 overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-right">
            <thead>
              <tr className="border-gold/15 font-farsi text-clay border-b text-sm">
                <th className="px-4 py-3 font-semibold">شماره</th>
                <th className="px-4 py-3 font-semibold">مشتری</th>
                <th className="px-4 py-3 font-semibold">اقلام</th>
                <th className="px-4 py-3 font-semibold">مبلغ</th>
                <th className="px-4 py-3 font-semibold">وضعیت</th>
                <th className="px-4 py-3 font-semibold">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-gold/10 font-farsi border-b text-sm last:border-0"
                >
                  <td className="text-espresso px-4 py-3 font-bold">{toPersianDigits(order.id)}</td>
                  <td className="text-espresso px-4 py-3">
                    {order.user ? (order.user.name ?? order.user.phone) : "مهمان"}
                  </td>
                  <td className="text-clay max-w-xs px-4 py-3">
                    {order.items
                      .map((item) => `${toPersianDigits(item.quantity)}× ${item.nameFa}`)
                      .join("، ")}
                  </td>
                  <td className="text-espresso px-4 py-3 font-bold whitespace-nowrap">
                    {formatToman(order.totalToman)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect orderId={order.id} status={order.status} />
                  </td>
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
