export const SHIPPING_METHODS = {
  standard: { label: "ارسال استاندارد", costToman: 70000 },
  pickup: { label: "تحویل حضوری از فروشگاه", costToman: 0 },
} as const;

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت موفق",
  failed: "پرداخت ناموفق",
  legacy: "ثبت‌شده در سیستم قبلی",
};

export function isShippingMethod(value: string): value is keyof typeof SHIPPING_METHODS {
  return value in SHIPPING_METHODS;
}

export function getShippingCost(method: string) {
  return isShippingMethod(method) ? SHIPPING_METHODS[method].costToman : 0;
}

export function paymentStatusLabel(status: string) {
  return PAYMENT_STATUS_LABELS[status] ?? status;
}
