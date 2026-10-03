import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { formatToman, toPersianDigits } from "@/lib/price";
import { formatJalaliDate } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      phone: true,
      name: true,
      createdAt: true,
      orders: { select: { totalToman: true } },
    },
  });

  return (
    <div dir="rtl">
      <h1 className="font-farsi-display text-espresso mb-5 text-xl">کاربران</h1>

      {users.length === 0 ? (
        <p className="font-farsi text-clay">هنوز کاربری ثبت‌نام نکرده است.</p>
      ) : (
        <div className="border-gold/20 overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full min-w-[600px] text-right">
            <thead>
              <tr className="border-gold/15 font-farsi text-clay border-b text-sm">
                <th className="px-4 py-3 font-semibold">نام</th>
                <th className="px-4 py-3 font-semibold">شماره موبایل</th>
                <th className="px-4 py-3 font-semibold">تعداد سفارش</th>
                <th className="px-4 py-3 font-semibold">مجموع خرید</th>
                <th className="px-4 py-3 font-semibold">عضویت از</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const totalSpent = user.orders.reduce((sum, order) => sum + order.totalToman, 0);
                return (
                  <tr
                    key={user.id}
                    className="border-gold/10 font-farsi hover:bg-latte/50 border-b text-sm last:border-0"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/customers/${user.id}`}
                        className="text-espresso font-bold"
                      >
                        {user.name ?? "—"}
                      </Link>
                    </td>
                    <td className="text-clay px-4 py-3" dir="ltr">
                      {user.phone}
                    </td>
                    <td className="text-espresso px-4 py-3">
                      {toPersianDigits(user.orders.length)}
                    </td>
                    <td className="text-espresso px-4 py-3 whitespace-nowrap">
                      {formatToman(totalSpent)}
                    </td>
                    <td className="text-clay px-4 py-3 whitespace-nowrap">
                      {formatJalaliDate(user.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
