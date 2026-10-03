"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { requestPasswordReset, resetPassword } from "@/app/actions/auth";
import { toast } from "@/lib/toastStore";
import { getSafeNextPath } from "@/lib/safeNext";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = getSafeNextPath(searchParams.get("next"));
  const [step, setStep] = useState<"phone" | "reset">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleRequestCode = (event: React.FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        const result = await requestPasswordReset(phone);
        toast.info(`چون سرویس پیامک وصل نیست، کد آزمایشی شما: ${result.demoCode}`);
        setStep("reset");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "درخواست کد با خطا مواجه شد");
      }
    });
  };

  const handleResetPassword = (event: React.FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        await resetPassword(phone, code, newPassword);
        toast.success("رمز عبور با موفقیت تغییر کرد");
        router.push(next || "/profile");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "بازیابی رمز عبور با خطا مواجه شد");
      }
    });
  };

  if (step === "phone") {
    return (
      <form onSubmit={handleRequestCode} dir="rtl" className="mt-6 flex flex-col gap-4">
        <p className="font-farsi text-clay -mt-2 text-center text-sm">
          شماره موبایل خود را وارد کنید تا کد تایید برای شما ارسال شود.
        </p>

        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="شماره موبایل"
          required
          className="font-farsi border-espresso/15 text-espresso focus:border-gold bg-latte/40 w-full rounded-lg border px-4 py-3 text-sm transition outline-none"
        />

        <button
          type="submit"
          disabled={isPending}
          className="font-farsi bg-espresso text-latte hover:bg-ink w-full rounded-full px-6 py-3 text-sm font-bold tracking-wide transition disabled:opacity-60"
        >
          {isPending ? "در حال ارسال..." : "دریافت کد تایید"}
        </button>

        <p className="font-farsi text-clay text-center text-sm">
          <Link
            href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
            className="text-gold font-semibold"
          >
            بازگشت به ورود
          </Link>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetPassword} dir="rtl" className="mt-6 flex flex-col gap-4">
      <p className="font-farsi text-clay -mt-2 text-center text-sm">
        کد تایید و رمز عبور جدید خود را وارد کنید.
      </p>

      <input
        type="text"
        inputMode="numeric"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="کد تایید"
        required
        className="font-farsi border-espresso/15 text-espresso focus:border-gold bg-latte/40 w-full rounded-lg border px-4 py-3 text-center text-sm tracking-[0.3em] transition outline-none"
      />

      <input
        type="password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        placeholder="رمز عبور جدید (حداقل ۸ کاراکتر)"
        required
        minLength={8}
        className="font-farsi border-espresso/15 text-espresso focus:border-gold bg-latte/40 w-full rounded-lg border px-4 py-3 text-sm transition outline-none"
      />

      <button
        type="submit"
        disabled={isPending}
        className="font-farsi bg-espresso text-latte hover:bg-ink w-full rounded-full px-6 py-3 text-sm font-bold tracking-wide transition disabled:opacity-60"
      >
        {isPending ? "در حال ثبت..." : "تغییر رمز عبور"}
      </button>

      <button
        type="button"
        onClick={() => setStep("phone")}
        className="font-farsi text-clay text-center text-sm"
      >
        شماره موبایل اشتباه است؟ بازگشت
      </button>
    </form>
  );
}
