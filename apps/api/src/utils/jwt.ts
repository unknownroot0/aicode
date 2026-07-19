import "dotenv/config";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { JWTPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be configured and at least 32 characters long");
}

export const generateToken = (
  userId: string,
  email: string,
  role: "CUSTOMER" | "ADMIN"
): string => {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET as Secret,
    { expiresIn: JWT_EXPIRY } as SignOptions
  );
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};
