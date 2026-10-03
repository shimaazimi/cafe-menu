"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { createProduct, updateProduct } from "@/app/actions/adminProducts";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/productCategories";
import { toast } from "@/lib/toastStore";

interface ProductValues {
  id: number;
  nameFa: string;
  description: string;
  priceToman: number;
  compareAtPrice: number | null;
  category: string;
  stockQuantity: number;
  imageUrl: string | null;
}

const inputClass =
  "font-farsi border-espresso/15 text-espresso focus:border-gold w-full rounded-lg border bg-latte/40 px-4 py-3 text-sm outline-none transition";

export default function ProductForm({ product }: { product?: ProductValues }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        if (product) {
          await updateProduct(product.id, formData);
        } else {
          await createProduct(formData);
        }
        router.push("/admin/products");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "ثبت محصول با خطا مواجه شد");
      }
    });
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} dir="rtl" className="flex max-w-lg flex-col gap-4">
      <input
        type="text"
        name="nameFa"
        placeholder="عنوان محصول"
        defaultValue={product?.nameFa}
        required
        className={inputClass}
      />

      <textarea
        name="description"
        placeholder="توضیحات"
        rows={3}
        defaultValue={product?.description}
        required
        className={inputClass}
      />

      <select
        name="category"
        defaultValue={product?.category ?? ""}
        required
        className={inputClass}
      >
        <option value="" disabled>
          دسته‌بندی را انتخاب کنید
        </option>
        {Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="priceToman"
        placeholder="قیمت (تومان)"
        defaultValue={product?.priceToman}
        required
        min={0}
        className={inputClass}
      />

      <input
        type="number"
        name="compareAtPrice"
        placeholder="قیمت قبل از تخفیف (اختیاری)"
        defaultValue={product?.compareAtPrice ?? ""}
        min={0}
        className={inputClass}
      />

      <input
        type="number"
        name="stockQuantity"
        placeholder="تعداد موجود"
        defaultValue={product?.stockQuantity ?? 0}
        required
        min={0}
        className={inputClass}
      />

      <div>
        <label className="font-farsi text-clay mb-2 block text-sm">
          {product ? "تغییر تصویر (اختیاری)" : "تصویر محصول (اختیاری)"}
        </label>

        {(previewUrl || product?.imageUrl) && (
          <div className="mb-2">
            <Image
              src={previewUrl ?? product!.imageUrl!}
              alt=""
              width={120}
              height={120}
              unoptimized={Boolean(previewUrl)}
              className="h-28 w-28 rounded-lg object-cover"
            />
          </div>
        )}

        <input
          type="file"
          name="photo"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handlePhotoChange}
          className="font-farsi text-clay text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="font-farsi bg-gold text-ink hover:bg-gold-light mt-2 w-full rounded-full px-6 py-3 text-sm font-bold tracking-wide transition disabled:opacity-60"
      >
        {isPending ? "در حال ذخیره..." : "ذخیره"}
      </button>
    </form>
  );
}
