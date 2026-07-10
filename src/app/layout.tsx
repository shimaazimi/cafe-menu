import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-farsi",
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
      <body className="font-farsi min-h-screen">{children}</body>
    </html>
  );
}
