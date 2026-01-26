import { type Request, type Response, type NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { errorResponse } from "../utils/response.ts";
import { StatusCodes } from "http-status-codes";

export const validate =
  (schema: ZodObject<any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        errorResponse(
          res,
          "Validation Error",
          StatusCodes.BAD_REQUEST,
          error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        );
      } else {
        next(error);
      }
    }
  };
