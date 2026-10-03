import { Suspense } from "react";

import { getCurrentUser } from "@/lib/auth";
import CartView from "./CartView";

export default async function CartPage() {
  const user = await getCurrentUser();

  return (
    <Suspense fallback={null}>
      <CartView isLoggedIn={Boolean(user)} />
    </Suspense>
  );
}
