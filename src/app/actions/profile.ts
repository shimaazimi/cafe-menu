"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("برای ادامه وارد حساب کاربری شوید");
  return user;
}

export async function updateProfileName(name: string) {
  const user = await requireUser();
  const normalized = name.trim();
  if (normalized.length < 2 || normalized.length > 80) {
    throw new Error("نام و نام خانوادگی را کامل وارد کنید");
  }

  await prisma.user.update({ where: { id: user.id }, data: { name: normalized } });
  revalidatePath("/profile");
}

export async function setDefaultAddress(addressId: number) {
  const user = await requireUser();
  if (!Number.isInteger(addressId)) throw new Error("نشانی معتبر نیست");

  await prisma.$transaction(async (tx) => {
    const address = await tx.userAddress.findFirst({ where: { id: addressId, userId: user.id } });
    if (!address) throw new Error("نشانی یافت نشد");

    await tx.userAddress.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    await tx.userAddress.update({ where: { id: address.id }, data: { isDefault: true } });
  });
  revalidatePath("/profile");
  revalidatePath("/cart");
}

export async function deleteAddress(addressId: number) {
  const user = await requireUser();
  if (!Number.isInteger(addressId)) throw new Error("نشانی معتبر نیست");

  await prisma.$transaction(async (tx) => {
    const address = await tx.userAddress.findFirst({ where: { id: addressId, userId: user.id } });
    if (!address) throw new Error("نشانی یافت نشد");

    await tx.userAddress.delete({ where: { id: address.id } });
    if (address.isDefault) {
      const replacement = await tx.userAddress.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      if (replacement) {
        await tx.userAddress.update({ where: { id: replacement.id }, data: { isDefault: true } });
      }
    }
  });
  revalidatePath("/profile");
  revalidatePath("/cart");
}
