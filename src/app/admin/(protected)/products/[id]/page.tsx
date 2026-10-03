import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) notFound();

  return (
    <div dir="rtl">
      <h1 className="font-farsi-display text-espresso mb-5 text-xl">ویرایش محصول</h1>
      <ProductForm product={product} />
    </div>
  );
}
