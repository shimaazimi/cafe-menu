import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/adminAuth";
import AdminNav from "./AdminNav";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div dir="rtl" className="bg-latte min-h-screen">
      <AdminNav adminName={admin.name ?? admin.phone} />
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
