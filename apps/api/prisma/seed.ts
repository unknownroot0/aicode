import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@diceymio.com" },
    update: {
      password: "$2b$10$D1a/.vCEQpapg22nudmP/ORyWWTJdixrmFjFIbE/SF3ePk1w//Cu6",
    },
    create: {
      email: "admin@diceymio.com",
      password: "$2b$10$D1a/.vCEQpapg22nudmP/ORyWWTJdixrmFjFIbE/SF3ePk1w//Cu6", // bcrypt hash of "Admin@123456"
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      emailVerified: true,
      admin: {
        create: {},
      },
    },
  });

  console.log("✅ Admin created:", admin.email);

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: "catan" },
      update: {},
      create: {
        id: "catan",
        name: "Catan",
        description:
          "Trade, build, and settle your way to resource management glory in this classic board game where every decision matters.",
        price: 45.99,
        stock: 5,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { id: "ticket-to-ride" },
      update: {},
      create: {
        id: "ticket-to-ride",
        name: "Ticket to Ride",
        description:
          "Claim railway routes across the map and complete destination tickets. The player with the longest continuous route wins!",
        price: 55.99,
        stock: 8,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${products.length} products created`);
  console.log("🌱 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
