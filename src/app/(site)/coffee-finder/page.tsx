import { prisma } from "@/lib/prisma";
import CoffeeFinder from "./CoffeeFinder";

export const dynamic = "force-dynamic";

export default async function CoffeeFinderPage() {
  const products = await prisma.product.findMany({
    where: { category: "beans", stockQuantity: { gt: 0 } },
    orderBy: { id: "asc" },
  });

  return (
    <main dir="rtl" className="bg-latte min-h-screen px-5 py-10 pb-24 md:px-8 md:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <span className="font-farsi text-gold text-sm font-bold">راهنمای انتخاب ساده و سریع</span>
        <h1 className="font-farsi-display text-espresso mt-2 text-3xl md:text-5xl">
          قهوه مناسب خودت را پیدا کن
        </h1>
        <p className="font-farsi text-clay mx-auto mt-3 max-w-xl leading-8">
          لازم نیست متخصص قهوه باشی؛ به سه سؤال جواب بده تا از بین محصولات موجود بهترین گزینه را
          ببینی.
        </p>
      </div>

      <CoffeeFinder
        products={products.map((product) => ({
          slug: product.slug,
          nameFa: product.nameFa,
          description: product.description,
          priceToman: product.priceToman,
          imageUrl: product.imageUrl,
          coffeeType: product.coffeeType,
          strength: product.strength,
          bitterness: product.bitterness,
          flavorNotes: product.flavorNotes,
          suitableFor: product.suitableFor,
          brewMethods: product.brewMethods,
        }))}
      />
    </main>
  );
}
