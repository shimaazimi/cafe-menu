export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار بررسی",
  preparing: "در حال آماده‌سازی",
  completed: "تحویل داده شد",
  cancelled: "لغو شده",
};

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}
