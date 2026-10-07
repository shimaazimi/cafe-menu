import { Suspense } from "react";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCustomerGrindOptions } from "@/lib/grindOptions";
import CartView from "./CartView";

export default async function CartPage() {
  const user = await getCurrentUser();
  const [addresses, grindProducts] = await Promise.all([
    user
      ? prisma.userAddress.findMany({
          where: { userId: user.id },
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        })
      : Promise.resolve([]),
    prisma.product.findMany({
      where: { grindingAvailable: true },
      select: { slug: true, grindingAvailable: true, grindOptions: true },
    }),
  ]);

  return (
    <Suspense fallback={null}>
      <CartView
        isLoggedIn={Boolean(user)}
        defaultName={user?.name ?? ""}
        defaultPhone={user?.phone ?? ""}
        savedAddresses={addresses.map((address) => ({
          id: address.id,
          label: address.label,
          recipientName: address.recipientName,
          recipientPhone: address.recipientPhone,
          province: address.province,
          city: address.city,
          postalAddress: address.postalAddress,
          postalCode: address.postalCode ?? "",
          isDefault: address.isDefault,
        }))}
        productGrindOptions={Object.fromEntries(
          grindProducts.map((product) => [
            product.slug,
            getCustomerGrindOptions(product.grindingAvailable, product.grindOptions),
          ]),
        )}
      />
    </Suspense>
  );
}
