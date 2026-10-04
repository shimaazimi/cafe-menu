ALTER TABLE "Product"
ADD COLUMN "coffeeType" TEXT,
ADD COLUMN "roastLevel" TEXT,
ADD COLUMN "strength" INTEGER,
ADD COLUMN "bitterness" INTEGER,
ADD COLUMN "acidity" INTEGER,
ADD COLUMN "flavorNotes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "suitableFor" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "brewMethods" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "weightGrams" INTEGER,
ADD COLUMN "wholesaleAvailable" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Product"
ADD CONSTRAINT "Product_strength_check" CHECK ("strength" IS NULL OR "strength" BETWEEN 1 AND 5),
ADD CONSTRAINT "Product_bitterness_check" CHECK ("bitterness" IS NULL OR "bitterness" BETWEEN 1 AND 5),
ADD CONSTRAINT "Product_acidity_check" CHECK ("acidity" IS NULL OR "acidity" BETWEEN 1 AND 5),
ADD CONSTRAINT "Product_weightGrams_check" CHECK ("weightGrams" IS NULL OR "weightGrams" > 0);
