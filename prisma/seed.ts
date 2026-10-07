import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { hashPassword } from "../src/lib/password";
import { normalizePhone } from "../src/lib/phone";
import { wholesaleCoffeeProducts } from "./data/wholesale-coffee-products";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set (expected a postgresql:// connection string)");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

const products = [
  {
    slug: "mug-espresso",
    nameFa: "ماگ اسپرسو کافه فرندز",
    description: "ماگ سرامیکی با طرح اختصاصی کافه فرندز، مناسب اسپرسو و نوشیدنی‌های داغ",
    priceToman: 250000,
    category: "mug",
    stockQuantity: 50,
  },
  {
    slug: "mug-latte",
    nameFa: "ماگ لاته بزرگ",
    description: "ماگ سرامیکی حجیم مناسب لاته و کاپوچینو",
    priceToman: 280000,
    compareAtPrice: 340000,
    category: "mug",
    stockQuantity: 50,
  },
  {
    slug: "french-press-350",
    nameFa: "فرنچ پرس ۳۵۰ میلی‌لیتر",
    description: "فرنچ پرس شیشه‌ای با بدنه استیل، مناسب دم‌آوری برای یک تا دو نفر",
    priceToman: 890000,
    category: "french-press",
    stockQuantity: 20,
  },
  {
    slug: "french-press-1000",
    nameFa: "فرنچ پرس ۱۰۰۰ میلی‌لیتر",
    description: "فرنچ پرس بزرگ خانواده، بدنه شیشه‌ای مقاوم و فیلتر استیل",
    priceToman: 1250000,
    category: "french-press",
    stockQuantity: 20,
  },
  {
    slug: "beans-house-blend-250",
    nameFa: "دانه قهوه هاوس بلند - ۲۵۰ گرم",
    description: "میکس اختصاصی کافه فرندز، رست متوسط با طعم شکلاتی و کاراملی",
    priceToman: 480000,
    category: "beans",
    stockQuantity: 100,
    coffeeType: "blend",
    roastLevel: "medium",
    strength: 4,
    bitterness: 3,
    acidity: 2,
    flavorNotes: ["chocolate", "caramel", "nuts"],
    suitableFor: ["home", "office"],
    brewMethods: ["espresso", "moka", "french_press"],
    weightGrams: 250,
    isAvailable: true,
    price250g: 480000,
    price500g: 960000,
    price1000g: 1920000,
    wholesaleAvailable: true,
  },
  {
    slug: "beans-espresso-1000",
    nameFa: "دانه قهوه اسپرسو - ۱ کیلوگرم",
    description: "بلند مخصوص اسپرسو، رست تیره با بادی بالا و کرمای غنی",
    priceToman: 1650000,
    compareAtPrice: 1950000,
    category: "beans",
    stockQuantity: 30,
    coffeeType: "blend",
    roastLevel: "dark",
    strength: 5,
    bitterness: 4,
    acidity: 1,
    flavorNotes: ["chocolate", "nuts"],
    suitableFor: ["home", "office", "cafe"],
    brewMethods: ["espresso", "moka"],
    weightGrams: 1000,
    isAvailable: true,
    price250g: 412500,
    price500g: 825000,
    price1000g: 1650000,
    wholesaleAvailable: true,
  },
  ...wholesaleCoffeeProducts,
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log(`Seeded ${products.length} products`);

  const seedPhoneRaw = process.env.ADMIN_SEED_PHONE;
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;

  if (seedPhoneRaw && seedPassword) {
    const phone = normalizePhone(seedPhoneRaw);
    if (!phone) {
      console.warn(`ADMIN_SEED_PHONE "${seedPhoneRaw}" is not a valid phone — skipped admin seed.`);
    } else {
      await prisma.adminUser.upsert({
        where: { phone },
        update: { passwordHash: hashPassword(seedPassword) },
        create: { phone, passwordHash: hashPassword(seedPassword) },
      });
      console.log(`Seeded admin user ${phone}`);
    }
  } else {
    console.log("ADMIN_SEED_PHONE/ADMIN_SEED_PASSWORD not set — skipped admin seed.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
