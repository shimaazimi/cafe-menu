import type { Metadata } from "next";
import { Vazirmatn, Lalezar } from "next/font/google";
import "./globals.css";

import ToastViewport from "@/components/shared/ToastViewport";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-farsi",
  display: "swap",
});

const lalezar = Lalezar({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-farsi-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "کافه فرندز | قهوه روزانه از قلب بازار تهران",
    template: "%s | کافه فرندز",
  },
  description:
    "خرید قهوه عربیکا، روبوستا و اکسسوری با انتخاب ساده و قیمت منطقی از بازار بزرگ تهران.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" data-scroll-behavior="smooth">
      <body className={`${vazirmatn.variable} ${lalezar.variable} font-farsi min-h-screen`}>
        {children}
        <ToastViewport />
      </body>
    </html>
  );
}
