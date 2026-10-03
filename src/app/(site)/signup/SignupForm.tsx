"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { signUp } from "@/app/actions/auth";
import { toast } from "@/lib/toastStore";
import { getSafeNextPath } from "@/lib/safeNext";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = getSafeNextPath(searchParams.get("next"));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        await signUp(phone, password, name);
        router.push(next || "/profile");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "ثبت‌نام با خطا مواجه شد");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} dir="rtl" className="mt-6 flex flex-col gap-4">
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="نام (اختیاری)"
        className="font-farsi border-espresso/15 text-espresso focus:border-gold bg-latte/40 w-full rounded-lg border px-4 py-3 text-sm transition outline-none"
      />

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
        placeholder="رمز عبور (حداقل ۸ کاراکتر)"
        required
        minLength={8}
        className="font-farsi border-espresso/15 text-espresso focus:border-gold bg-latte/40 w-full rounded-lg border px-4 py-3 text-sm transition outline-none"
      />

      <button
        type="submit"
        disabled={isPending}
        className="font-farsi bg-espresso text-latte hover:bg-ink w-full rounded-full px-6 py-3 text-sm font-bold tracking-wide transition disabled:opacity-60"
      >
        {isPending ? "در حال ثبت‌نام..." : "ثبت‌نام"}
      </button>

      <p className="font-farsi text-clay text-center text-sm">
        حساب کاربری دارید؟{" "}
        <Link
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          className="text-gold font-semibold"
        >
          وارد شوید
        </Link>
      </p>
    </form>
  );
}
