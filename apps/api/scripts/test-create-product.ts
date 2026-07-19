import prisma from "../src/config/database";
import "dotenv/config";

async function main() {
  try {
    const product = await prisma.product.create({
      data: {
        name: "Test Product (script)",
        description: "Created by test script",
        price: 9.99,
        stock: 5,
        images: [],
        sku: "TEST-SKU-1",
      },
    });

    console.log("Created product:", product);
  } catch (err: any) {
    console.error("Error creating product:", err.message || err);
    if (err.code) console.error("code:", err.code);
    if (err.meta) console.error("meta:", err.meta);
  } finally {
    await prisma.$disconnect();
  }
}

main();
