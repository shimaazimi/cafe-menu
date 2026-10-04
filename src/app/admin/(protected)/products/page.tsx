import Image from "next/image";
import Link from "next/link";
import { Package, Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatToman, toPersianDigits } from "@/lib/price";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/productCategories";
import DeleteProductButton from "./DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div dir="rtl">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-farsi-display text-espresso text-xl">محصولات</h1>

        <Link
          href="/admin/products/new"
          className="font-farsi bg-gold text-ink hover:bg-gold-light flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          افزودن محصول
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="font-farsi text-clay">هنوز محصولی ثبت نشده است.</p>
      ) : (
        <div className="border-gold/20 overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-right">
            <thead>
              <tr className="border-gold/15 font-farsi text-clay border-b text-sm">
                <th className="px-4 py-3 font-semibold">تصویر</th>
                <th className="px-4 py-3 font-semibold">عنوان</th>
                <th className="px-4 py-3 font-semibold">دسته‌بندی</th>
                <th className="px-4 py-3 font-semibold">قیمت</th>
                <th className="px-4 py-3 font-semibold">موجودی</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-gold/10 font-farsi border-b text-sm last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="bg-latte border-gold/15 relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.nameFa}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <Package className="text-espresso/40 h-5 w-5" strokeWidth={1.5} />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-espresso font-bold"
                    >
                      {product.nameFa}
                    </Link>
                  </td>
                  <td className="text-clay px-4 py-3">
                    {PRODUCT_CATEGORY_LABELS[product.category] ?? product.category}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.compareAtPrice && (
                      <div className="text-clay/70 text-xs line-through">
                        {formatToman(product.compareAtPrice)}
                      </div>
                    )}
                    <div className="text-espresso font-bold">
                      {product.priceOnRequest ? "استعلام" : formatToman(product.priceToman)}
                    </div>
                    {product.priceBasisGrams === 1000 && !product.priceOnRequest && (
                      <div className="text-clay/70 text-[10px]">هر کیلو</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        product.stockQuantity === 0
                          ? "font-bold text-red-600"
                          : "text-espresso font-bold"
                      }
                    >
                      {toPersianDigits(product.stockQuantity)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <DeleteProductButton productId={product.id} productName={product.nameFa} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
