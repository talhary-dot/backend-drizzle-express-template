import { type Request, type Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../utils/response.ts";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("[ErrorHandler]", err);

  // Handle specific errors (e.g. Zod validation, Database) here if needed in future

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  errorResponse(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === "development" ? err : null,
  );
};
