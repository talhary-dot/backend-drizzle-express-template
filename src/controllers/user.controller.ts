import { type Request, type Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "../services/user.service.ts";
import { successResponse, errorResponse } from "../utils/response.ts";
import { auth } from "../config/auth.ts";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userService.getAll();
    successResponse(res, users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const user = await userService.getById(id);
    if (!user) {
      // We can throw or use errorResponse directly, depending on preference.
      throw { statusCode: StatusCodes.NOT_FOUND, message: "User not found" };
    }
    successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userService.create(req.body);
    successResponse(
      res,
      user,
      "User created successfully",
      StatusCodes.CREATED,
    );
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const user = await userService.update(id, req.body);
    if (!user) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "User not found" };
    }
    successResponse(res, user, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const user = await userService.delete(id);
    if (!user) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "User not found" };
    }
    successResponse(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getAuthMethods = async (
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

    const userId = session.user.id;
    const methods = await userService.getAuthMethods(userId);
    successResponse(res, methods);
  } catch (error) {
    next(error);
  }
};
