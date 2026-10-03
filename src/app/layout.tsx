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
  title: "کافه فرندز",
  description: "منوی دیجیتال کافه فرندز",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} ${lalezar.variable} font-farsi min-h-screen`}>
        {children}
        <ToastViewport />
      </body>
    </html>
  );
}
