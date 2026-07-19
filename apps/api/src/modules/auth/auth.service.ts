import prisma from "../../config/database";
import crypto from "crypto";
import { hashPassword, comparePassword } from "../../utils/password";
import { generateToken } from "../../utils/jwt";
import {
  ConflictError,
  UnauthorizedError,
  InternalServerError,
  NotFoundError,
  BadRequestError,
} from "../../utils/errors";
import { SignupInput, LoginInput } from "./auth.validation";

export const signup = async (input: SignupInput) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    const canClaimGuestUser =
      existingUser.role === "CUSTOMER" &&
      !existingUser.firstName &&
      !existingUser.lastName &&
      !existingUser.emailVerified;

    if (!canClaimGuestUser) {
      throw new ConflictError("Email already in use");
    }

    const hashedPassword = await hashPassword(input.password);
    const user = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
        isActive: true,
      },
    });

    const token = generateToken(user.id, user.email, user.role as "CUSTOMER" | "ADMIN");

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    };
  }

  // Hash password
  const hashedPassword = await hashPassword(input.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      role: "CUSTOMER",
      customer: {
        create: {},
      },
    },
  });

  // Generate token
  const token = generateToken(user.id, user.email, user.role as "CUSTOMER" | "ADMIN");

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  };
};

export const findOrCreateCheckoutUser = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    return existingUser;
  }

  const password = await hashPassword(crypto.randomBytes(32).toString("hex"));
  return prisma.user.create({
    data: {
      email: normalizedEmail,
      password,
      role: "CUSTOMER",
      emailVerified: false,
      isActive: true,
      customer: {
        create: {},
      },
    },
  });
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  // Verify password
  const isPasswordValid = await comparePassword(input.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  if (!user.isActive) {
    throw new UnauthorizedError("Account is inactive");
  }

  // Generate token
  const token = generateToken(user.id, user.email, user.role as "CUSTOMER" | "ADMIN");

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

export const updateProfile = async (userId: string, data: { firstName?: string; lastName?: string; phone?: string }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const changePassword = async (userId: string, data: { currentPassword?: string; newPassword?: string }) => {
  if (!data.currentPassword || !data.newPassword) {
    throw new BadRequestError("Current password and new password are required");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Verify current password
  const isPasswordValid = await comparePassword(data.currentPassword, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid current password");
  }

  // Hash new password
  const hashedPassword = await hashPassword(data.newPassword);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });

  return { message: "Password changed successfully" };
};
