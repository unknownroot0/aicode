import { Response } from "express";
import { ApiResponse } from "../types";

export const sendSuccess = <T = unknown>(
  res: Response,
  statusCode: number,
  data: T,
  message: string = "Success"
) => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  error: string,
  message?: string
) => {
  const response: ApiResponse = {
    success: false,
    error,
    message,
  };
  res.status(statusCode).json(response);
};
