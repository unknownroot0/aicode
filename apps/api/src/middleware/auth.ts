import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { verifyToken } from "../utils/jwt";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";
import prisma from "../config/database";
import { getAuthCookieName, readCookie } from "../utils/cookies";

export const authenticate = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const cookieToken = readCookie(req.headers.cookie, getAuthCookieName());
    const token = bearerToken || cookieToken;

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError("Invalid token");
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    next(new UnauthorizedError("Invalid token"));
  }
};

export const optionalAuthenticate = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const cookieToken = readCookie(req.headers.cookie, getAuthCookieName());
    const token = bearerToken || cookieToken;

    if (!token) {
      return next();
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (user?.isActive) {
      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
    }

    return next();
  } catch {
    return next();
  }
};

export const authorizeAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required");
  }

  if (req.user.role !== "ADMIN") {
    throw new ForbiddenError("Admin access required");
  }

  next();
};
