import { type Request, type Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { adminService } from "../services/admin.service.ts";
import { successResponse } from "../utils/response.ts";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await adminService.getUsers(page, limit);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };
    const { role } = req.body as { role: string };

    if (!role) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Role is required",
      };
    }

    const user = await adminService.updateUserRole(id, role);
    if (!user) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "User not found" };
    }
    successResponse(res, user, "User role updated");
  } catch (error) {
    next(error);
  }
};

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await adminService.getStats();
    successResponse(res, stats);
  } catch (error) {
    next(error);
  }
};
