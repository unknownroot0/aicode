import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  // Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Server
  PORT: z.coerce.number().default(5000),
  API_URL: z.string().url(),
  WEB_URL: z.string().url(),
  CORS_ORIGIN: z.string(),

  // Database
  DATABASE_URL: z.string().min(1),

  // JWT
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRY: z.string().default("7d"),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1),

  // SSLCommerz
  SSLCOMMERZ_STORE_ID: z.string().min(1),
  SSLCOMMERZ_STORE_PASSWORD: z.string().min(1),
  SSLCOMMERZ_API_URL: z.string().url(),
  SSLCOMMERZ_VALIDATION_URL: z.string().url(),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),

  // Admin
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );

  process.exit(1);
}

export const env = parsed.data;

export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";