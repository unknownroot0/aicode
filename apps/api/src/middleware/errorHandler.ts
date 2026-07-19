import { Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { sendError } from "../utils/response";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: Error | AppError,
  _req: any,
  res: Response,
  _next: NextFunction
) => {
  console.error("[ERROR]", err);

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message, err.code);
  }

  if (err instanceof ZodError) {
    const message = err.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    return sendError(res, 400, `Validation Error: ${message}`, "VALIDATION_ERROR");
  }

  sendError(res, 500, "Internal Server Error");
};
