import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: "CUSTOMER" | "ADMIN";
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  iat: number;
  exp: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
