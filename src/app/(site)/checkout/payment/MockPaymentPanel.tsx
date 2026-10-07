"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

import { completeMockPayment } from "@/app/actions/orders";
import { useCart } from "@/context/CartContext";
import { toast } from "@/lib/toastStore";

export default function MockPaymentPanel({ orderId }: { orderId: number }) {
  const router = useRouter();
  const { clear } = useCart();
  const [choice, setChoice] = useState<"success" | "failed" | null>(null);
  const [isPending, startTransition] = useTransition();

  const pay = (outcome: "success" | "failed") => {
    setChoice(outcome);
    startTransition(async () => {
      try {
        const result = await completeMockPayment(orderId, outcome);
        if (result.status === "success") clear();
        router.push(`/checkout/result?order=${orderId}`);
      } catch (error) {
        setChoice(null);
        toast.error(error instanceof Error ? error.message : "پرداخت آزمایشی انجام نشد");
      }
    });
  };

  return (
    <div className="mt-7 grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => pay("success")}
        disabled={isPending}
        className="font-farsi flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        <CheckCircle2 className="h-4 w-4" />
        {isPending && choice === "success" ? "در حال پرداخت..." : "شبیه‌سازی پرداخت موفق"}
      </button>
      <button
        type="button"
        onClick={() => pay("failed")}
        disabled={isPending}
        className="font-farsi flex items-center justify-center gap-2 rounded-full border border-red-200 px-5 py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
      >
        <XCircle className="h-4 w-4" />
        {isPending && choice === "failed" ? "در حال بررسی..." : "شبیه‌سازی پرداخت ناموفق"}
      </button>
    </div>
  );
}
