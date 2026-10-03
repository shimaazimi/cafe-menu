"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { PRODUCT_CATEGORIES } from "@/lib/productCategories";
import { deleteProductPhoto, saveProductPhoto } from "@/lib/productPhoto";

function generateSlug(category: string) {
  return `${category}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

interface ParsedFields {
  nameFa: string;
  description: string;
  priceToman: number;
  compareAtPrice: number | null;
  category: string;
  stockQuantity: number;
  photo: File | null;
}

function parseFields(formData: FormData): ParsedFields {
  const nameFa = String(formData.get("nameFa") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceToman = Number(formData.get("priceToman"));
  const compareAtPriceRaw = String(formData.get("compareAtPrice") ?? "").trim();
  const compareAtPrice = compareAtPriceRaw ? Number(compareAtPriceRaw) : null;
  const category = String(formData.get("category") ?? "");
  const stockQuantity = Number(formData.get("stockQuantity"));
  const photoValue = formData.get("photo");
  const photo = photoValue instanceof File && photoValue.size > 0 ? photoValue : null;

  if (!nameFa || !description) {
    throw new Error("عنوان و توضیحات الزامی هستند");
  }
  if (!Number.isFinite(priceToman) || priceToman < 0) {
    throw new Error("قیمت نامعتبر است");
  }
  if (!PRODUCT_CATEGORIES.includes(category)) {
    throw new Error("دسته‌بندی نامعتبر است");
  }
  if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    throw new Error("تعداد موجودی نامعتبر است");
  }
  if (compareAtPrice !== null && (!Number.isFinite(compareAtPrice) || compareAtPrice < 0)) {
    throw new Error("قیمت قبل از تخفیف نامعتبر است");
  }

  return { nameFa, description, priceToman, compareAtPrice, category, stockQuantity, photo };
}

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("دسترسی غیرمجاز");
  }
}

function revalidateShopPaths() {
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const fields = parseFields(formData);

  const slug = generateSlug(fields.category);
  const imageUrl = fields.photo ? await saveProductPhoto(fields.photo, slug) : null;

  const product = await prisma.product.create({
    data: {
      slug,
      nameFa: fields.nameFa,
      description: fields.description,
      priceToman: fields.priceToman,
      compareAtPrice: fields.compareAtPrice,
      category: fields.category,
      stockQuantity: fields.stockQuantity,
      imageUrl,
    },
  });

  revalidateShopPaths();
  return product;
}

export async function updateProduct(productId: number, formData: FormData) {
  await requireAdmin();
  const fields = parseFields(formData);

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing) {
    throw new Error("محصول یافت نشد");
  }

  let imageUrl = existing.imageUrl;
  if (fields.photo) {
    imageUrl = await saveProductPhoto(fields.photo, existing.slug);
    await deleteProductPhoto(existing.imageUrl);
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      nameFa: fields.nameFa,
      description: fields.description,
      priceToman: fields.priceToman,
      compareAtPrice: fields.compareAtPrice,
      category: fields.category,
      stockQuantity: fields.stockQuantity,
      imageUrl,
    },
  });

  revalidateShopPaths();
  return product;
}

export async function deleteProduct(productId: number) {
  await requireAdmin();

  const product = await prisma.product.delete({ where: { id: productId } }).catch(() => null);
  if (product) {
    await deleteProductPhoto(product.imageUrl);
  }

  revalidateShopPaths();
}
