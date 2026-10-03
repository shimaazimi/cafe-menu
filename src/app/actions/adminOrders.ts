"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";

export async function updateOrderStatus(orderId: number, status: string) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("دسترسی غیرمجاز");
  }

  if (!Object.keys(ORDER_STATUS_LABELS).includes(status)) {
    throw new Error("وضعیت سفارش نامعتبر است");
  }

  await prisma.order.update({ where: { id: orderId }, data: { status } });

  revalidatePath("/admin/orders");
  revalidatePath("/profile");
}
