import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import { globalErrorHandler } from "./middleware/errorHandler";
import authRoutes from "./modules/auth/auth.route";
import productRoutes from "./modules/product/product.route";
import cartRoutes from "./modules/cart/cart.route";
import orderRoutes from "./modules/order/order.route";
import { sslcommerzSuccessController, sslcommerzFailController, sslcommerzIpnController } from "./modules/order/order.controller";
import adminProductRoutes from "./modules/admin/admin-product.route";
import adminOrderRoutes from "./modules/admin/admin-order.route";
import adminUserRoutes from "./modules/admin/admin-user.route";
import couponRoutes from "./modules/coupon/coupon.route";
import addressRoutes from "./modules/address/address.route";
import { rateLimit } from "./middleware/rateLimit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.WEB_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "uploads/products");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// SSLCommerz payment callbacks — registered BEFORE CORS middleware because
// these requests come from SSLCommerz servers/browser redirects with Origin: null.
// Body parsers are applied inline since global middleware hasn't run yet.
const sslBody = [express.json({ limit: "1mb" }), express.urlencoded({ extended: true, limit: "1mb" })];
app.get("/api/orders/payment/success", ...sslBody, sslcommerzSuccessController);
app.post("/api/orders/payment/success", ...sslBody, sslcommerzSuccessController);
app.get("/api/orders/payment/fail", ...sslBody, sslcommerzFailController);
app.post("/api/orders/payment/fail", ...sslBody, sslcommerzFailController);
app.get("/api/orders/payment/cancel", ...sslBody, sslcommerzFailController);
app.post("/api/orders/payment/cancel", ...sslBody, sslcommerzFailController);
app.post("/api/orders/payment/ipn", ...sslBody, sslcommerzIpnController);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin images
}));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Serve static files
const staticPath = path.join(process.cwd(), "uploads");
console.log(`[Static] Serving files from: ${staticPath}`);
app.use("/uploads", express.static(staticPath, {
  setHeaders(res) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  },
}));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 500, keyPrefix: "api" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/addresses", addressRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error Handler (must be last)
app.use(globalErrorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
