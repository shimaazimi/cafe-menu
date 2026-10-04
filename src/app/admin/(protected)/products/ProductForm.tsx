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
  priceOnRequest: boolean;
  compareAtPrice: number | null;
  category: string;
  stockQuantity: number;
  imageUrl: string | null;
  coffeeType: string | null;
  roastLevel: string | null;
  strength: number | null;
  bitterness: number | null;
  acidity: number | null;
  flavorNotes: string[];
  suitableFor: string[];
  brewMethods: string[];
  weightGrams: number | null;
  priceBasisGrams: number | null;
  minimumOrderGrams: number | null;
  wholesaleAvailable: boolean;
  catalogOnly: boolean;
  productForm: string | null;
  originCountry: string | null;
  grade: string | null;
  processingMethod: string | null;
  arabicaPercent: number | null;
  robustaPercent: number | null;
  body: number | null;
  sweetness: number | null;
  caffeineLevel: number | null;
  aiProfile: string | null;
  profileConfidence: string | null;
  researchSourceUrl: string | null;
  sourceNote: string | null;
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

      <label className="font-farsi text-espresso flex items-center gap-2 text-sm">
        <input type="checkbox" name="priceOnRequest" defaultChecked={product?.priceOnRequest} />
        قیمت فقط با استعلام اعلام شود
      </label>

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

      <div className="border-gold/20 grid gap-4 rounded-2xl border bg-white p-4 sm:grid-cols-2">
        <p className="font-farsi text-espresso text-sm font-bold sm:col-span-2">
          مشخصات قهوه (برای دسته دانه قهوه)
        </p>

        <select name="coffeeType" defaultValue={product?.coffeeType ?? ""} className={inputClass}>
          <option value="">نوع قهوه</option>
          <option value="arabica">عربیکا</option>
          <option value="robusta">روبوستا</option>
          <option value="blend">ترکیبی</option>
        </select>

        <select name="roastLevel" defaultValue={product?.roastLevel ?? ""} className={inputClass}>
          <option value="">درجه رست</option>
          <option value="light">روشن</option>
          <option value="medium">متوسط</option>
          <option value="dark">تیره</option>
        </select>

        <select name="productForm" defaultValue={product?.productForm ?? ""} className={inputClass}>
          <option value="">شکل محصول</option>
          <option value="whole_bean">دانه</option>
          <option value="ground">آسیاب‌شده</option>
          <option value="instant">فوری</option>
        </select>

        <input
          name="originCountry"
          placeholder="کشور مبدأ: Ethiopia"
          defaultValue={product?.originCountry ?? ""}
          className={inputClass}
        />
        <input
          name="grade"
          placeholder="گرید: PB, AA, G1"
          defaultValue={product?.grade ?? ""}
          className={inputClass}
        />
        <input
          name="processingMethod"
          placeholder="فرآوری: natural, washed"
          defaultValue={product?.processingMethod ?? ""}
          className={inputClass}
        />

        {[
          ["strength", "شدت (۱ تا ۵)", product?.strength],
          ["bitterness", "تلخی (۱ تا ۵)", product?.bitterness],
          ["acidity", "اسیدیته (۱ تا ۵)", product?.acidity],
          ["body", "بادی (۱ تا ۵)", product?.body],
          ["sweetness", "شیرینی (۱ تا ۵)", product?.sweetness],
          ["caffeineLevel", "کافئین (۱ تا ۵)", product?.caffeineLevel],
          ["weightGrams", "وزن (گرم)", product?.weightGrams],
          ["priceBasisGrams", "مبنای قیمت (گرم)", product?.priceBasisGrams],
          ["minimumOrderGrams", "حداقل سفارش (گرم)", product?.minimumOrderGrams],
          ["arabicaPercent", "درصد عربیکا", product?.arabicaPercent],
          ["robustaPercent", "درصد روبوستا", product?.robustaPercent],
        ].map(([name, placeholder, value]) => (
          <input
            key={String(name)}
            type="number"
            name={String(name)}
            placeholder={String(placeholder)}
            defaultValue={value ?? ""}
            min={
              ["weightGrams", "priceBasisGrams", "minimumOrderGrams"].includes(String(name))
                ? 1
                : ["arabicaPercent", "robustaPercent"].includes(String(name))
                  ? 0
                  : 1
            }
            max={
              ["weightGrams", "priceBasisGrams", "minimumOrderGrams"].includes(String(name))
                ? undefined
                : ["arabicaPercent", "robustaPercent"].includes(String(name))
                  ? 100
                  : 5
            }
            className={inputClass}
          />
        ))}

        <input
          name="flavorNotes"
          placeholder="طعم‌ها با ویرگول: chocolate, nuts"
          defaultValue={product?.flavorNotes.join(", ")}
          className={`${inputClass} sm:col-span-2`}
        />

        <textarea
          name="aiProfile"
          placeholder="راهنمای دقیق برای پیشنهادگر هوشمند"
          rows={4}
          defaultValue={product?.aiProfile ?? ""}
          className={`${inputClass} sm:col-span-2`}
        />
        <input
          name="profileConfidence"
          placeholder="سطح اطمینان داده"
          defaultValue={product?.profileConfidence ?? ""}
          className={inputClass}
        />
        <input
          type="url"
          name="researchSourceUrl"
          placeholder="لینک منبع تحقیق"
          defaultValue={product?.researchSourceUrl ?? ""}
          className={inputClass}
        />
        <textarea
          name="sourceNote"
          placeholder="یادداشت منبع قیمت و محصول"
          rows={3}
          defaultValue={product?.sourceNote ?? ""}
          className={`${inputClass} sm:col-span-2`}
        />
        <input
          name="brewMethods"
          placeholder="روش‌ها: espresso, moka, french_press, filter"
          defaultValue={product?.brewMethods.join(", ")}
          className={`${inputClass} sm:col-span-2`}
        />
        <input
          name="suitableFor"
          placeholder="مناسب برای: home, office, cafe"
          defaultValue={product?.suitableFor.join(", ")}
          className={`${inputClass} sm:col-span-2`}
        />

        <label className="font-farsi text-espresso flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            name="wholesaleAvailable"
            defaultChecked={product?.wholesaleAvailable}
          />
          امکان فروش همکاری
        </label>

        <label className="font-farsi text-espresso flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" name="catalogOnly" defaultChecked={product?.catalogOnly} />
          فقط کاتالوگ/استعلام (غیرقابل افزودن مستقیم به سبد)
        </label>
      </div>

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
