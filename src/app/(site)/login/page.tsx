import { Suspense } from "react";
import { LogIn } from "lucide-react";

import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main dir="rtl" className="bg-latte min-h-screen">
      <div className="mx-auto flex max-w-sm items-center px-6 pt-10 pb-16 md:min-h-[calc(100vh-8rem)] md:py-10">
        <div className="border-gold/20 bg-white p-6 shadow-sm md:w-full md:rounded-2xl md:p-8 md:shadow-lg">
          <div className="flex flex-col items-center">
            <div className="border-gold/40 bg-gold/10 flex h-16 w-16 items-center justify-center rounded-full border">
              <LogIn className="text-gold h-6 w-6" strokeWidth={1.5} />
            </div>

            <h1 className="font-farsi-display text-espresso mt-4 text-center text-2xl">ورود</h1>
            <div className="border-gold/40 mt-3 w-14 border-t" />
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>

      <div className="h-16 md:hidden" aria-hidden />
    </main>
  );
}
