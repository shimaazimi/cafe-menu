"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { PRODUCT_CATEGORIES } from "@/lib/productCategories";
import { deleteProductPhoto, saveProductPhoto } from "@/lib/productPhoto";
import { splitList } from "@/lib/coffeeProduct";

function generateSlug(category: string) {
  return `${category}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

interface ParsedFields {
  nameFa: string;
  description: string;
  priceToman: number;
  priceOnRequest: boolean;
  compareAtPrice: number | null;
  category: string;
  stockQuantity: number;
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
  photo: File | null;
}

function optionalNumber(formData: FormData, name: string) {
  const raw = String(formData.get(name) ?? "").trim();
  return raw ? Number(raw) : null;
}

function parseFields(formData: FormData): ParsedFields {
  const nameFa = String(formData.get("nameFa") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceToman = Number(formData.get("priceToman"));
  const priceOnRequest = formData.get("priceOnRequest") === "on";
  const compareAtPriceRaw = String(formData.get("compareAtPrice") ?? "").trim();
  const compareAtPrice = compareAtPriceRaw ? Number(compareAtPriceRaw) : null;
  const category = String(formData.get("category") ?? "");
  const stockQuantity = Number(formData.get("stockQuantity"));
  const coffeeType = String(formData.get("coffeeType") ?? "").trim() || null;
  const roastLevel = String(formData.get("roastLevel") ?? "").trim() || null;
  const strength = optionalNumber(formData, "strength");
  const bitterness = optionalNumber(formData, "bitterness");
  const acidity = optionalNumber(formData, "acidity");
  const body = optionalNumber(formData, "body");
  const sweetness = optionalNumber(formData, "sweetness");
  const caffeineLevel = optionalNumber(formData, "caffeineLevel");
  const flavorNotes = splitList(formData.get("flavorNotes"));
  const suitableFor = splitList(formData.get("suitableFor"));
  const brewMethods = splitList(formData.get("brewMethods"));
  const weightGrams = optionalNumber(formData, "weightGrams");
  const priceBasisGrams = optionalNumber(formData, "priceBasisGrams");
  const minimumOrderGrams = optionalNumber(formData, "minimumOrderGrams");
  const arabicaPercent = optionalNumber(formData, "arabicaPercent");
  const robustaPercent = optionalNumber(formData, "robustaPercent");
  const wholesaleAvailable = formData.get("wholesaleAvailable") === "on";
  const catalogOnly = formData.get("catalogOnly") === "on";
  const productForm = String(formData.get("productForm") ?? "").trim() || null;
  const originCountry = String(formData.get("originCountry") ?? "").trim() || null;
  const grade = String(formData.get("grade") ?? "").trim() || null;
  const processingMethod = String(formData.get("processingMethod") ?? "").trim() || null;
  const aiProfile = String(formData.get("aiProfile") ?? "").trim() || null;
  const profileConfidence = String(formData.get("profileConfidence") ?? "").trim() || null;
  const researchSourceUrl = String(formData.get("researchSourceUrl") ?? "").trim() || null;
  const sourceNote = String(formData.get("sourceNote") ?? "").trim() || null;
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
  for (const [label, value] of [
    ["شدت", strength],
    ["تلخی", bitterness],
    ["اسیدیته", acidity],
    ["بادی", body],
    ["شیرینی", sweetness],
    ["کافئین", caffeineLevel],
  ] as const) {
    if (value !== null && (!Number.isInteger(value) || value < 1 || value > 5)) {
      throw new Error(`${label} باید عددی بین ۱ تا ۵ باشد`);
    }
  }
  if (weightGrams !== null && (!Number.isInteger(weightGrams) || weightGrams <= 0)) {
    throw new Error("وزن نامعتبر است");
  }
  for (const [label, value] of [
    ["مبنای قیمت", priceBasisGrams],
    ["حداقل سفارش", minimumOrderGrams],
  ] as const) {
    if (value !== null && (!Number.isInteger(value) || value <= 0)) {
      throw new Error(`${label} نامعتبر است`);
    }
  }
  for (const [label, value] of [
    ["درصد عربیکا", arabicaPercent],
    ["درصد روبوستا", robustaPercent],
  ] as const) {
    if (value !== null && (!Number.isInteger(value) || value < 0 || value > 100)) {
      throw new Error(`${label} باید عددی بین ۰ تا ۱۰۰ باشد`);
    }
  }
  if (
    arabicaPercent !== null &&
    robustaPercent !== null &&
    arabicaPercent + robustaPercent !== 100
  ) {
    throw new Error("مجموع درصد عربیکا و روبوستا باید ۱۰۰ باشد");
  }

  return {
    nameFa,
    description,
    priceToman,
    priceOnRequest,
    compareAtPrice,
    category,
    stockQuantity,
    coffeeType,
    roastLevel,
    strength,
    bitterness,
    acidity,
    body,
    sweetness,
    caffeineLevel,
    flavorNotes,
    suitableFor,
    brewMethods,
    weightGrams,
    priceBasisGrams,
    minimumOrderGrams,
    arabicaPercent,
    robustaPercent,
    wholesaleAvailable,
    catalogOnly,
    productForm,
    originCountry,
    grade,
    processingMethod,
    aiProfile,
    profileConfidence,
    researchSourceUrl,
    sourceNote,
    photo,
  };
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
      priceOnRequest: fields.priceOnRequest,
      compareAtPrice: fields.compareAtPrice,
      category: fields.category,
      stockQuantity: fields.stockQuantity,
      imageUrl,
      coffeeType: fields.coffeeType,
      roastLevel: fields.roastLevel,
      strength: fields.strength,
      bitterness: fields.bitterness,
      acidity: fields.acidity,
      body: fields.body,
      sweetness: fields.sweetness,
      caffeineLevel: fields.caffeineLevel,
      flavorNotes: fields.flavorNotes,
      suitableFor: fields.suitableFor,
      brewMethods: fields.brewMethods,
      weightGrams: fields.weightGrams,
      priceBasisGrams: fields.priceBasisGrams,
      minimumOrderGrams: fields.minimumOrderGrams,
      arabicaPercent: fields.arabicaPercent,
      robustaPercent: fields.robustaPercent,
      wholesaleAvailable: fields.wholesaleAvailable,
      catalogOnly: fields.catalogOnly,
      productForm: fields.productForm,
      originCountry: fields.originCountry,
      grade: fields.grade,
      processingMethod: fields.processingMethod,
      aiProfile: fields.aiProfile,
      profileConfidence: fields.profileConfidence,
      researchSourceUrl: fields.researchSourceUrl,
      sourceNote: fields.sourceNote,
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
      priceOnRequest: fields.priceOnRequest,
      compareAtPrice: fields.compareAtPrice,
      category: fields.category,
      stockQuantity: fields.stockQuantity,
      imageUrl,
      coffeeType: fields.coffeeType,
      roastLevel: fields.roastLevel,
      strength: fields.strength,
      bitterness: fields.bitterness,
      acidity: fields.acidity,
      body: fields.body,
      sweetness: fields.sweetness,
      caffeineLevel: fields.caffeineLevel,
      flavorNotes: fields.flavorNotes,
      suitableFor: fields.suitableFor,
      brewMethods: fields.brewMethods,
      weightGrams: fields.weightGrams,
      priceBasisGrams: fields.priceBasisGrams,
      minimumOrderGrams: fields.minimumOrderGrams,
      arabicaPercent: fields.arabicaPercent,
      robustaPercent: fields.robustaPercent,
      wholesaleAvailable: fields.wholesaleAvailable,
      catalogOnly: fields.catalogOnly,
      productForm: fields.productForm,
      originCountry: fields.originCountry,
      grade: fields.grade,
      processingMethod: fields.processingMethod,
      aiProfile: fields.aiProfile,
      profileConfidence: fields.profileConfidence,
      researchSourceUrl: fields.researchSourceUrl,
      sourceNote: fields.sourceNote,
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
