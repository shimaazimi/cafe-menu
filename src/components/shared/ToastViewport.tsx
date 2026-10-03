"use client";

import { useSyncExternalStore } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

import { subscribeToasts, getToastSnapshot, dismissToast } from "@/lib/toastStore";

const VARIANT_STYLES = {
  error: {
    icon: TriangleAlert,
    className: "border-red-300 bg-red-50 text-red-700",
    iconClassName: "text-red-500",
  },
  success: {
    icon: CheckCircle2,
    className: "border-gold/40 bg-white text-espresso",
    iconClassName: "text-gold",
  },
  info: {
    icon: Info,
    className: "border-espresso/15 bg-white text-espresso",
    iconClassName: "text-clay",
  },
} as const;

export default function ToastViewport() {
  const toasts = useSyncExternalStore(subscribeToasts, getToastSnapshot, getToastSnapshot);

  if (toasts.length === 0) return null;

  return (
    <div
      dir="rtl"
      className="pointer-events-none fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((item) => {
        const style = VARIANT_STYLES[item.variant];
        const Icon = style.icon;

        return (
          <div
            key={item.id}
            className={`font-farsi pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg ${style.className}`}
          >
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.iconClassName}`} strokeWidth={1.75} />

            <p className="flex-1 leading-6">{item.message}</p>

            <button
              onClick={() => dismissToast(item.id)}
              aria-label="بستن"
              className="opacity-60 transition hover:opacity-100"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
