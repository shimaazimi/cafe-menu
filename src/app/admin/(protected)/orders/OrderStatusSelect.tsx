"use client";

import { useTransition } from "react";

import { updateOrderStatus } from "@/app/actions/adminOrders";
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import { toast } from "@/lib/toastStore";

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: number;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;

    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "به‌روزرسانی وضعیت با خطا مواجه شد");
      }
    });
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className="font-farsi border-espresso/15 text-espresso focus:border-gold rounded-lg border bg-white px-2 py-1.5 text-xs transition outline-none disabled:opacity-50"
    >
      {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
