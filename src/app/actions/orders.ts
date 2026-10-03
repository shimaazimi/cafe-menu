"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

interface OrderItemInput {
  itemId: string;
  nameFa: string;
  unitPriceToman: number;
  quantity: number;
}

export async function createOrder(items: OrderItemInput[], note?: string) {
  if (items.length === 0) {
    throw new Error("سبد خرید خالی است");
  }

  // Checkout is gated behind login (see CartView.tsx), so this should always resolve —
  // but derive it from the session rather than trusting a client-supplied id.
  const user = await getCurrentUser();

  const totalToman = items.reduce((sum, item) => sum + item.unitPriceToman * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      totalToman,
      note,
      userId: user?.id,
      items: {
        create: items.map((item) => ({
          itemId: item.itemId,
          nameFa: item.nameFa,
          unitPriceToman: item.unitPriceToman,
          quantity: item.quantity,
        })),
      },
    },
  });

  return { id: order.id, totalToman: order.totalToman };
}
