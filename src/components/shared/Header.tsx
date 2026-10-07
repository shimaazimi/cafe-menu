import Link from "next/link";
import { ShoppingBag, BookOpen, LogIn, Sparkles, Store, User } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { logOut } from "@/app/actions/auth";
import CartNavLink from "@/components/shared/CartNavLink";
import BrandMark from "@/components/shared/BrandMark";
import BottomNav from "@/components/shared/BottomNav";

export default async function Header() {
  const user = await getCurrentUser();

  const iconBtn =
    "flex h-9 items-center justify-center gap-1.5 px-2 text-gold-light/80 transition hover:text-gold-light md:px-3";

  return (
    <>
      <header dir="rtl" className="site-header bg-ink relative z-20 w-full">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3 md:max-w-4xl md:px-8 md:py-4 lg:max-w-6xl lg:px-12">
          <Link href="/" aria-label="کافه فرندز">
            <BrandMark size={34} />
          </Link>

          <nav className="flex items-center gap-0.5 md:gap-1">
            <Link href="/menu" aria-label="منو" className={iconBtn}>
              <BookOpen className="h-4.5 w-4.5" strokeWidth={1.5} />
              <span className="font-farsi hidden text-sm font-semibold md:inline">منو</span>
            </Link>

            <Link href="/shop" aria-label="فروشگاه" className={iconBtn}>
              <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.5} />
              <span className="font-farsi hidden text-sm font-semibold md:inline">فروشگاه</span>
            </Link>

            <Link href="/coffee-finder" aria-label="راهنمای انتخاب قهوه" className={iconBtn}>
              <Sparkles className="h-4.5 w-4.5" strokeWidth={1.5} />
              <span className="font-farsi hidden text-sm font-semibold md:inline">انتخاب قهوه</span>
            </Link>

            <Link href="/business" aria-label="همکاری" className={`${iconBtn} hidden lg:flex`}>
              <Store className="h-4.5 w-4.5" strokeWidth={1.5} />
              <span className="font-farsi hidden text-sm font-semibold md:inline">همکاری</span>
            </Link>

            <Link href="/about" aria-label="درباره ما" className={`${iconBtn} hidden xl:flex`}>
              <span className="font-farsi text-sm font-semibold">درباره ما</span>
            </Link>

            <CartNavLink className="text-gold-light/80 hover:text-gold-light" />

            {user ? (
              <div className="mr-1 flex items-center gap-1 md:mr-2 md:gap-2">
                <Link href="/profile" aria-label={user.name ?? user.phone} className={iconBtn}>
                  <User className="h-4.5 w-4.5" strokeWidth={1.5} />
                  <span className="font-farsi hidden max-w-24 truncate text-sm font-semibold md:inline">
                    {user.name ?? user.phone}
                  </span>
                </Link>

                <form action={logOut}>
                  <button type="submit" aria-label="خروج" className={iconBtn}>
                    <LogIn className="h-4.5 w-4.5 rotate-180" strokeWidth={1.5} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="mr-1 flex items-center gap-1.5 md:mr-2 md:gap-2.5">
                <Link href="/login" aria-label="ورود" className={iconBtn}>
                  <LogIn className="h-4.5 w-4.5" strokeWidth={1.5} />
                  <span className="font-farsi hidden text-sm font-semibold md:inline">ورود</span>
                </Link>

                <Link
                  href="/signup"
                  className="font-farsi bg-gold text-ink hover:bg-gold-light rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition md:px-5 md:py-2 md:text-sm"
                >
                  ثبت‌نام
                </Link>
              </div>
            )}
          </nav>
        </div>

        <div className="divider-ornate" aria-hidden />
      </header>

      <BottomNav isLoggedIn={Boolean(user)} />
    </>
  );
}
