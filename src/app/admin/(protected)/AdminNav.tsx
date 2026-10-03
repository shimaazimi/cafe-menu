"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { LogOut, Package, ShoppingCart, Users } from "lucide-react";

import { adminLogOut } from "@/app/actions/adminAuth";

const NAV_ITEMS = [
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart },
  { href: "/admin/customers", label: "کاربران", icon: Users },
  { href: "/admin/products", label: "محصولات", icon: Package },
];

export default function AdminNav({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogOut = () => {
    startTransition(async () => {
      await adminLogOut();
      router.push("/admin/login");
      router.refresh();
    });
  };

  return (
    <header className="bg-ink relative z-20 w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <span className="font-farsi-display text-gold-light text-lg">پنل مدیریت کافه فرندز</span>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-farsi flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  active ? "bg-gold text-ink" : "text-gold-light/80 hover:text-gold-light"
                }`}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}

          <span className="text-gold-light/50 mx-2 hidden text-xs md:inline">{adminName}</span>

          <button
            onClick={handleLogOut}
            disabled={isPending}
            aria-label="خروج"
            className="text-gold-light/80 hover:text-gold-light flex h-9 w-9 items-center justify-center transition disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </nav>
      </div>

      <div className="divider-ornate" aria-hidden />
    </header>
  );
}
