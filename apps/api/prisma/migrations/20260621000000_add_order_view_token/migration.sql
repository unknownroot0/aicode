ALTER TABLE "Order" ADD COLUMN "viewToken" TEXT;
CREATE UNIQUE INDEX "Order_viewToken_key" ON "Order"("viewToken");
