"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import { deleteProduct } from "@/app/actions/adminProducts";
import { toast } from "@/lib/toastStore";

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: number;
  productName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`محصول «${productName}» حذف شود؟`)) return;

    startTransition(async () => {
      try {
        await deleteProduct(productId);
        toast.success("محصول حذف شد");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "حذف محصول با خطا مواجه شد");
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      aria-label="حذف محصول"
      className="text-clay flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
    </button>
  );
}
