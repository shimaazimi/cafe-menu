"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { normalizePhone } from "@/lib/phone";
import { formatPackageWeight, getPackageOptions, usesPackagePricing } from "@/lib/productPackages";
import { getCustomerGrindOptions } from "@/lib/grindOptions";
import { getShippingCost, isShippingMethod } from "@/lib/checkout";

interface OrderItemInput {
  itemId: string;
  productSlug?: string;
  weightGrams?: number;
  grindOption?: string;
  quantity: number;
}

export interface CheckoutDetails {
  recipientName: string;
  recipientPhone: string;
  province: string;
  city: string;
  postalAddress: string;
  postalCode?: string;
  shippingMethod: string;
  note?: string;
}

function legacyProductReference(itemId: string) {
  const packageMatch = itemId.match(/^(.*):(250|500|1000)$/);
  if (packageMatch) return { slug: packageMatch[1], weightGrams: Number(packageMatch[2]) };
  return { slug: itemId.split("::")[0], weightGrams: null };
}

function validateCheckout(details: CheckoutDetails) {
  const recipientName = details.recipientName.trim();
  const recipientPhone = normalizePhone(details.recipientPhone);
  const province = details.province.trim();
  const city = details.city.trim();
  const postalAddress = details.postalAddress.trim();
  const postalCode = details.postalCode?.trim() || null;

  if (recipientName.length < 2) throw new Error("نام تحویل‌گیرنده را کامل وارد کنید");
  if (!recipientPhone) throw new Error("شماره موبایل تحویل‌گیرنده معتبر نیست");
  if (province.length < 2 || city.length < 2) throw new Error("استان و شهر را کامل وارد کنید");
  if (postalAddress.length < 10) throw new Error("نشانی کامل را وارد کنید");
  if (postalCode && !/^[0-9۰-۹٠-٩-]{5,20}$/.test(postalCode)) {
    throw new Error("کد پستی معتبر نیست");
  }
  if (!isShippingMethod(details.shippingMethod)) throw new Error("روش ارسال معتبر نیست");

  return {
    recipientName,
    recipientPhone,
    province,
    city,
    postalAddress,
    postalCode,
    shippingMethod: details.shippingMethod,
    note: details.note?.trim() || null,
  };
}

export async function createOrder(items: OrderItemInput[], details: CheckoutDetails) {
  if (items.length === 0) throw new Error("سبد خرید خالی است");

  const user = await getCurrentUser();
  if (!user) throw new Error("برای ثبت سفارش وارد حساب کاربری شوید");

  const checkout = validateCheckout(details);
  const requested = items.map((item) => {
    const legacy = legacyProductReference(item.itemId);
    return {
      ...item,
      slug: item.productSlug?.trim() || legacy.slug,
      weightGrams: item.weightGrams ?? legacy.weightGrams,
      grindOption: item.grindOption?.trim() || null,
    };
  });

  const products = await prisma.product.findMany({
    where: { slug: { in: Array.from(new Set(requested.map((item) => item.slug))) } },
  });
  const productBySlug = new Map(products.map((product) => [product.slug, product]));

  const verifiedItems = requested.map((item) => {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
      throw new Error("تعداد محصول نامعتبر است");
    }

    const product = productBySlug.get(item.slug);
    if (!product || product.priceOnRequest || product.catalogOnly) {
      throw new Error("این محصول در حال حاضر قابل خرید نیست");
    }

    const allowedGrinds = getCustomerGrindOptions(product.grindingAvailable, product.grindOptions);
    if (
      allowedGrinds.length > 0 &&
      (!item.grindOption || !allowedGrinds.includes(item.grindOption))
    ) {
      throw new Error(`نوع آسیاب «${product.nameFa}» را انتخاب کنید`);
    }
    if (allowedGrinds.length === 0 && item.grindOption) {
      throw new Error("آسیاب انتخاب‌شده برای این محصول معتبر نیست");
    }

    if (usesPackagePricing(product.category)) {
      if (!product.isAvailable || !item.weightGrams) {
        throw new Error("محصول یا وزن انتخاب‌شده موجود نیست");
      }
      const option = getPackageOptions(product).find(
        (candidate) => candidate.weightGrams === item.weightGrams,
      );
      if (!option) throw new Error("وزن انتخاب‌شده معتبر نیست");

      return {
        itemId: item.itemId,
        nameFa: `${product.nameFa} - ${formatPackageWeight(item.weightGrams)}`,
        unitPriceToman: option.priceToman,
        quantity: item.quantity,
        grindOption: item.grindOption,
      };
    }

    if (product.stockQuantity < item.quantity) throw new Error("موجودی محصول کافی نیست");

    return {
      itemId: item.itemId,
      nameFa: product.nameFa,
      unitPriceToman: product.priceToman,
      quantity: item.quantity,
      grindOption: item.grindOption,
    };
  });

  const subtotalToman = verifiedItems.reduce(
    (sum, item) => sum + item.unitPriceToman * item.quantity,
    0,
  );
  const shippingCostToman = getShippingCost(checkout.shippingMethod);
  const totalToman = subtotalToman + shippingCostToman;

  const order = await prisma.$transaction(async (tx) => {
    const matchingAddress = await tx.userAddress.findFirst({
      where: {
        userId: user.id,
        province: checkout.province,
        city: checkout.city,
        postalAddress: checkout.postalAddress,
      },
    });

    if (matchingAddress) {
      await tx.userAddress.update({
        where: { id: matchingAddress.id },
        data: {
          recipientName: checkout.recipientName,
          recipientPhone: checkout.recipientPhone,
          postalCode: checkout.postalCode,
        },
      });
    } else {
      const addressCount = await tx.userAddress.count({ where: { userId: user.id } });
      await tx.userAddress.create({
        data: {
          userId: user.id,
          label: addressCount === 0 ? "آدرس اصلی" : "آدرس جدید",
          recipientName: checkout.recipientName,
          recipientPhone: checkout.recipientPhone,
          province: checkout.province,
          city: checkout.city,
          postalAddress: checkout.postalAddress,
          postalCode: checkout.postalCode,
          isDefault: addressCount === 0,
        },
      });
    }

    return tx.order.create({
      data: {
        status: "awaiting_payment",
        subtotalToman,
        shippingCostToman,
        totalToman,
        note: checkout.note,
        recipientName: checkout.recipientName,
        recipientPhone: checkout.recipientPhone,
        province: checkout.province,
        city: checkout.city,
        postalAddress: checkout.postalAddress,
        postalCode: checkout.postalCode,
        shippingMethod: checkout.shippingMethod,
        paymentStatus: "pending",
        paymentMethod: "mock_gateway",
        userId: user.id,
        items: { create: verifiedItems },
      },
    });
  });

  return { id: order.id, totalToman: order.totalToman };
}

export async function completeMockPayment(orderId: number, outcome: "success" | "failed") {
  const user = await getCurrentUser();
  if (!user) throw new Error("برای پرداخت وارد حساب کاربری شوید");
  if (!Number.isInteger(orderId)) throw new Error("شماره سفارش معتبر نیست");

  const order = await prisma.order.findFirst({ where: { id: orderId, userId: user.id } });
  if (!order) throw new Error("سفارش یافت نشد");
  if (order.status === "cancelled") throw new Error("این سفارش لغو شده است");
  if (order.paymentStatus === "paid") {
    return { status: "success" as const, reference: order.paymentReference };
  }

  if (outcome === "failed") {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "failed", paymentReference: null, paidAt: null },
    });
    return { status: "failed" as const, reference: null };
  }

  const reference = `MOCK-${Date.now().toString(36).toUpperCase()}-${order.id}`;
  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "paid",
      paymentReference: reference,
      paidAt: new Date(),
      status: "pending",
    },
  });

  return { status: "success" as const, reference };
}
