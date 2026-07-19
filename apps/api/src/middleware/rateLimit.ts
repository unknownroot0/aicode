import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

type RateLimitOptions = {
  windowMs: number;
  max: number;
  keyPrefix?: string;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}, 60_000).unref();

export const rateLimit = ({ windowMs, max, keyPrefix = "rl" }: RateLimitOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const forwardedFor = req.headers["x-forwarded-for"];
    const ip = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(",")[0]?.trim() || req.ip || req.socket.remoteAddress || "unknown";
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    bucket.count += 1;
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    res.setHeader("Retry-After", String(retryAfter));

    if (bucket.count > max) {
      return sendError(res, 429, "Too many requests. Please try again later.", "RATE_LIMITED");
    }

    return next();
  };
};
