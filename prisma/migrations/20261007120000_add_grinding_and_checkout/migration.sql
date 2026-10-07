ALTER TABLE "Product"
ADD COLUMN "grindingAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "grindOptions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "OrderItem"
ADD COLUMN "grindOption" TEXT;

ALTER TABLE "Order"
ADD COLUMN "subtotalToman" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "shippingCostToman" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "recipientName" TEXT,
ADD COLUMN "recipientPhone" TEXT,
ADD COLUMN "province" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "postalAddress" TEXT,
ADD COLUMN "postalCode" TEXT,
ADD COLUMN "shippingMethod" TEXT NOT NULL DEFAULT 'standard',
ADD COLUMN "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN "paymentMethod" TEXT NOT NULL DEFAULT 'mock_gateway',
ADD COLUMN "paymentReference" TEXT,
ADD COLUMN "paidAt" TIMESTAMP(3);

UPDATE "Order"
SET "subtotalToman" = "totalToman",
    "paymentStatus" = 'legacy';
