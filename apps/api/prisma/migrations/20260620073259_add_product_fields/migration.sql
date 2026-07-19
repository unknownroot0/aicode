/*
  Warnings:

  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "image",
ADD COLUMN     "cardMaterial" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "howToPlayUrl" TEXT,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "playTime" TEXT,
ADD COLUMN     "players" TEXT,
ADD COLUMN     "shippingInfo" TEXT,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "thumbnail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
