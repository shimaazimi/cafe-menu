import { ShieldCheck } from "lucide-react";

import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main dir="rtl" className="bg-latte flex min-h-screen items-center justify-center px-6">
      <div className="border-gold/20 w-full max-w-sm rounded-2xl border bg-white p-6 shadow-lg md:p-8">
        <div className="flex flex-col items-center">
          <div className="border-gold/40 bg-gold/10 flex h-16 w-16 items-center justify-center rounded-full border">
            <ShieldCheck className="text-gold h-6 w-6" strokeWidth={1.5} />
          </div>

          <h1 className="font-farsi-display text-espresso mt-4 text-center text-2xl">
            پنل مدیریت کافه فرندز
          </h1>
          <div className="border-gold/40 mt-3 w-14 border-t" />
        </div>

        <AdminLoginForm />
      </div>
    </main>
  );
}
