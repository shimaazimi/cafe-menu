"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { adminLogIn } from "@/app/actions/adminAuth";
import { toast } from "@/lib/toastStore";

export default function AdminLoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        await adminLogIn(phone, password);
        router.push("/admin/orders");
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

      <button
        type="submit"
        disabled={isPending}
        className="font-farsi bg-espresso text-latte hover:bg-ink w-full rounded-full px-6 py-3 text-sm font-bold tracking-wide transition disabled:opacity-60"
      >
        {isPending ? "در حال ورود..." : "ورود"}
      </button>
    </form>
  );
}
