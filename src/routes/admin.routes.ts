import { Router } from "express";
import { z } from "zod";
import * as adminController from "../controllers/admin.controller.ts";
import { requireRole } from "../middleware/auth.ts";
import { validate } from "../middleware/validate.ts";

const router = Router();

// Protect all routes with admin role
router.use(requireRole("admin"));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management API
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Retrieve a list of users (Admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of users with pagination
 */
router.get("/users", adminController.getUsers);

const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(["user", "admin"]),
  }),
});

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Update a user's role (Admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User role updated
 */
router.patch(
  "/users/:id/role",
  validate(updateRoleSchema),
  adminController.updateUserRole,
);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get("/stats", adminController.getStats);

export default router;
