"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { logIn } from "@/app/actions/auth";
import { toast } from "@/lib/toastStore";
import { getSafeNextPath } from "@/lib/safeNext";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = getSafeNextPath(searchParams.get("next"));
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        await logIn(phone, password);
        router.push(next || "/profile");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "ورود با خطا مواجه شد");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} dir="rtl" className="mt-6 flex flex-col gap-4">
      <input
        type="tel"
        inputMode="tel"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="شماره موبایل"
        required
        className="font-farsi border-espresso/15 text-espresso focus:border-gold bg-latte/40 w-full rounded-lg border px-4 py-3 text-sm transition outline-none"
      />

      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="رمز عبور"
        required
        className="font-farsi border-espresso/15 text-espresso focus:border-gold bg-latte/40 w-full rounded-lg border px-4 py-3 text-sm transition outline-none"
      />

      <Link
        href={next ? `/forgot-password?next=${encodeURIComponent(next)}` : "/forgot-password"}
        className="font-farsi text-gold -mt-1 text-left text-xs font-semibold"
      >
        فراموشی رمز عبور؟
      </Link>

      <button
        type="submit"
        disabled={isPending}
        className="font-farsi bg-espresso text-latte hover:bg-ink w-full rounded-full px-6 py-3 text-sm font-bold tracking-wide transition disabled:opacity-60"
      >
        {isPending ? "در حال ورود..." : "ورود"}
      </button>

      <p className="font-farsi text-clay text-center text-sm">
        حساب کاربری ندارید؟{" "}
        <Link
          href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}
          className="text-gold font-semibold"
        >
          ثبت‌نام کنید
        </Link>
      </p>
    </form>
  );
}
