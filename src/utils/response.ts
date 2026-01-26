import { type Response } from "express";
import { StatusCodes } from "http-status-codes";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T | null,
  errors?: any,
) => {
  res.status(statusCode).json({
    success,
    message,
    data: data || null,
    errors: errors || null,
  });
};

export const successResponse = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = StatusCodes.OK,
) => {
  sendResponse(res, statusCode, true, message, data);
};

export const errorResponse = (
  res: Response,
  message = "An error occurred",
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  errors: any = null,
) => {
  sendResponse(res, statusCode, false, message, null, errors);
};
