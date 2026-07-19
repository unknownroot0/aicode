import "dotenv/config";
import { createProduct } from "../src/modules/admin/admin-product.service";
import prisma from "../src/config/database";

async function main() {
  try {
    console.log("Attempting to create product with duplicate SKU via service...");
    const input = {
      name: "Service Test Product",
      description: "Created by service test script",
      price: 12.5,
      stock: 3,
      images: [],
      sku: "TEST-SKU-1",
    };

    const product = await createProduct(input as any);
    console.log("Service created product:", product);
  } catch (err: any) {
    console.error("Service error:", err.message || err);
    if (err.code) console.error("code:", err.code);
  } finally {
    await prisma.$disconnect();
  }
}

main();
