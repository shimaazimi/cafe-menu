"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, Sparkles, User } from "lucide-react";

import { useCart } from "@/context/CartContext";

interface BottomNavProps {
  isLoggedIn: boolean;
}

export default function BottomNav({ isLoggedIn }: BottomNavProps) {
  const pathname = usePathname();
  const { totalItems } = useCart();

  // CartView.tsx owns the bottom action bar on /cart — avoid stacking two fixed bars.
  if (pathname === "/cart") return null;

  const items = [
    { href: "/", label: "خانه", icon: Home, active: pathname === "/" },
    {
      href: "/shop",
      label: "فروشگاه",
      icon: ShoppingBag,
      active: pathname.startsWith("/shop"),
    },
    {
      href: "/coffee-finder",
      label: "انتخاب",
      icon: Sparkles,
      active: pathname === "/coffee-finder",
    },
    { href: "/cart", label: "سبد", icon: ShoppingCart, active: false, badge: totalItems },
    {
      href: isLoggedIn ? "/profile" : "/login",
      label: "حساب",
      icon: User,
      active: ["/profile", "/login", "/signup", "/forgot-password"].includes(pathname),
    },
  ];

  return (
    <nav
      dir="rtl"
      className="site-bottom-nav border-gold/20 fixed inset-x-0 bottom-0 z-20 flex items-stretch justify-around border-t bg-white/95 backdrop-blur md:hidden"
    >
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          aria-label={item.label}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold transition ${
            item.active ? "text-gold" : "text-espresso/50"
          }`}
        >
          <span className="relative">
            <item.icon className="h-5 w-5" strokeWidth={item.active ? 2 : 1.5} />

            {!!item.badge && (
              <span className="bg-gold text-ink absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold">
                {item.badge}
              </span>
            )}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
