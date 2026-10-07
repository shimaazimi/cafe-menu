-- CreateTable
CREATE TABLE "UserAddress" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'آدرس من',
    "recipientName" TEXT NOT NULL,
    "recipientPhone" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalAddress" TEXT NOT NULL,
    "postalCode" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserAddress_userId_idx" ON "UserAddress"("userId");

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Keep complete delivery addresses from existing orders in each customer's profile.
INSERT INTO "UserAddress" (
    "label", "recipientName", "recipientPhone", "province", "city",
    "postalAddress", "postalCode", "isDefault", "createdAt", "updatedAt", "userId"
)
SELECT DISTINCT ON (
    "userId", "province", "city", "postalAddress", COALESCE("postalCode", '')
)
    'آدرس سفارش', "recipientName", "recipientPhone", "province", "city",
    "postalAddress", "postalCode", false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, "userId"
FROM "Order"
WHERE "userId" IS NOT NULL
  AND "recipientName" IS NOT NULL
  AND "recipientPhone" IS NOT NULL
  AND "province" IS NOT NULL
  AND "city" IS NOT NULL
  AND "postalAddress" IS NOT NULL
ORDER BY "userId", "province", "city", "postalAddress", COALESCE("postalCode", ''), "createdAt" DESC;

UPDATE "UserAddress" AS address
SET "isDefault" = true
WHERE address."id" = (
    SELECT MIN(candidate."id")
    FROM "UserAddress" AS candidate
    WHERE candidate."userId" = address."userId"
);
