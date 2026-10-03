"use server";

import { randomInt } from "crypto";

import { prisma } from "@/lib/prisma";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";
import { normalizePhone } from "@/lib/phone";

const RESET_CODE_TTL_MS = 5 * 60 * 1000;

export async function signUp(phone: string, password: string, name?: string) {
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    throw new Error("شماره موبایل معتبر نیست");
  }
  if (password.length < 8) {
    throw new Error("رمز عبور باید حداقل ۸ کاراکتر باشد");
  }

  const existing = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
  if (existing) {
    throw new Error("این شماره موبایل قبلاً ثبت‌نام کرده است");
  }

  const user = await prisma.user.create({
    data: {
      phone: normalizedPhone,
      passwordHash: hashPassword(password),
      name: name?.trim() || null,
    },
  });

  await createSession(user.id);
  return { id: user.id, name: user.name, phone: user.phone };
}

export async function logIn(phone: string, password: string) {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    throw new Error("شماره موبایل معتبر نیست");
  }

  const user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new Error("شماره موبایل یا رمز عبور اشتباه است");
  }

  await createSession(user.id);
  return { id: user.id, name: user.name, phone: user.phone };
}

export async function logOut() {
  await destroySession();
}

/**
 * Demo-mode password reset: no SMS provider is configured for this project,
 * so the verification code is returned to the caller (shown via a toast)
 * instead of being sent by text message.
 */
export async function requestPasswordReset(phone: string) {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    throw new Error("شماره موبایل معتبر نیست");
  }

  const user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
  if (!user) {
    throw new Error("کاربری با این شماره موبایل یافت نشد");
  }

  const code = randomInt(100000, 1000000).toString();

  await prisma.passwordResetCode.create({
    data: {
      phone: normalizedPhone,
      code,
      expiresAt: new Date(Date.now() + RESET_CODE_TTL_MS),
    },
  });

  return { phone: normalizedPhone, demoCode: code };
}

export async function resetPassword(phone: string, code: string, newPassword: string) {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    throw new Error("شماره موبایل معتبر نیست");
  }
  if (newPassword.length < 8) {
    throw new Error("رمز عبور باید حداقل ۸ کاراکتر باشد");
  }

  const resetCode = await prisma.passwordResetCode.findFirst({
    where: { phone: normalizedPhone, code: code.trim(), consumed: false },
    orderBy: { createdAt: "desc" },
  });

  if (!resetCode || resetCode.expiresAt < new Date()) {
    throw new Error("کد تایید نامعتبر یا منقضی شده است");
  }

  const user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
  if (!user) {
    throw new Error("کاربری با این شماره موبایل یافت نشد");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(newPassword) },
    }),
    prisma.passwordResetCode.update({
      where: { id: resetCode.id },
      data: { consumed: true },
    }),
  ]);

  await createSession(user.id);
}
