import { type Request, type Response, type NextFunction } from "express";
import { auth } from "../config/auth.ts";
import { StatusCodes } from "http-status-codes";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as unknown as HeadersInit,
    });

    if (!session || !session.user) {
      throw { statusCode: StatusCodes.UNAUTHORIZED, message: "Unauthorized" };
    }

    (req as any).user = session.user;
    (req as any).session = session.session;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as unknown as HeadersInit,
      });

      if (!session || !session.user) {
        throw { statusCode: StatusCodes.UNAUTHORIZED, message: "Unauthorized" };
      }

      const user = session.user as any; // Cast to access custom properties like role

      if (user.role !== role && user.role !== "admin") {
        // Allow admin to access everything usually
        // But here allow specific role match. If role is 'admin', logic holds.
        if (user.role !== role) {
          throw { statusCode: StatusCodes.FORBIDDEN, message: "Forbidden" };
        }
      }

      (req as any).user = session.user;
      (req as any).session = session.session;
      next();
    } catch (error) {
      next(error);
    }
  };
};
