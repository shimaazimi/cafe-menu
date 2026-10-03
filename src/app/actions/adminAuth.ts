"use server";

import { prisma } from "@/lib/prisma";
import { createAdminSession, destroyAdminSession } from "@/lib/adminAuth";
import { verifyPassword } from "@/lib/password";
import { normalizePhone } from "@/lib/phone";

export async function adminLogIn(phone: string, password: string) {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    throw new Error("شماره موبایل معتبر نیست");
  }

  const admin = await prisma.adminUser.findUnique({ where: { phone: normalizedPhone } });
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    throw new Error("شماره موبایل یا رمز عبور اشتباه است");
  }

  await createAdminSession(admin.id);
  return { id: admin.id, name: admin.name, phone: admin.phone };
}

export async function adminLogOut() {
  await destroyAdminSession();
}
