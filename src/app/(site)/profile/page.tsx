import { redirect } from "next/navigation";
import { Gift } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatToman } from "@/lib/price";
import { formatJalaliDate } from "@/lib/date";
import ProfileTabs from "./ProfileTabs";

const REWARD_POINTS = 120;
const POINTS_PER_FREE_DRINK = 150;

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const displayName = user.name ?? user.phone;

  const rawOrders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const orders = rawOrders.map((order) => ({
    id: order.id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    totalFormatted: formatToman(order.totalToman),
    dateFormatted: formatJalaliDate(order.createdAt),
    address:
      order.province && order.city && order.postalAddress
        ? `${order.province}، ${order.city}، ${order.postalAddress}`
        : null,
    items: order.items.map((item) => ({
      nameFa: item.grindOption ? `${item.nameFa} (${item.grindOption})` : item.nameFa,
      quantity: item.quantity,
    })),
  }));

  return (
    <main dir="rtl" className="bg-latte min-h-screen">
      <div className="bg-ink px-6 pt-8 pb-10 md:py-12">
        <div className="mx-auto max-w-md md:max-w-2xl">
          <div className="flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-right">
            <div className="flex items-center gap-4">
              <div className="bg-gold text-ink flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold md:h-20 md:w-20 md:text-2xl">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <h1 className="font-farsi-display text-gold-light mt-3 text-xl md:mt-0 md:text-2xl">
                خوش آمدی، {displayName}!
              </h1>
            </div>
          </div>

          <div className="border-gold/30 mt-6 flex items-center justify-between rounded-2xl border bg-white/5 px-5 py-4">
            <div className="flex items-center gap-3">
              <Gift className="text-gold h-6 w-6" strokeWidth={1.5} />
              <div className="font-farsi text-sm">
                <p className="text-gold-light font-bold">{REWARD_POINTS} امتیاز</p>
                <p className="text-latte/60 text-xs">
                  {POINTS_PER_FREE_DRINK - REWARD_POINTS} امتیاز تا یک قهوه رایگان
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider-ornate" aria-hidden />

      <div className="mx-auto max-w-md px-6 pt-6 pb-16 md:max-w-2xl">
        <ProfileTabs name={displayName} phone={user.phone} orders={orders} />
      </div>

      <div className="h-16 md:hidden" aria-hidden />
    </main>
  );
}
