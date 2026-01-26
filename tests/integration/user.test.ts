import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/server.ts";
import { db } from "../../libs/db/index.ts";
import { users } from "../../src/models/user.ts";
import { eq } from "drizzle-orm";

describe("User API Integration Tests", () => {
  // Test data
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    role: "user",
  };

  let createdUserId: string;

  // Cleanup before tests
  beforeAll(async () => {
    await db.delete(users).where(eq(users.email, testUser.email));
  });

  // Cleanup after tests
  afterAll(async () => {
    if (createdUserId) {
      await db.delete(users).where(eq(users.id, createdUserId));
    }
  });

  describe("POST /api/users", () => {
    it("should validation error if body is invalid", async () => {
      const res = await request(app).post("/api/users").send({
        name: "", // Invalid: min length 1
        email: "invalid-email", // Invalid email
      });

      expect(res.status).toBe(400); // Assuming validation middleware returns 400
    });

    it("should create a new user", async () => {
      const res = await request(app).post("/api/users").send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.name).toBe(testUser.name);
      expect(res.body.data.email).toBe(testUser.email);

      createdUserId = res.body.data.id;
    });
  });

  describe("GET /api/users", () => {
    it("should return a list of users", async () => {
      const res = await request(app).get("/api/users");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      // Ensure our created user is in the list
      const found = res.body.data.find((u: any) => u.id === createdUserId);
      expect(found).toBeDefined();
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return 404 for non-existent user", async () => {
      const res = await request(app).get("/api/users/999999");
      expect(res.status).toBe(404);
    });

    it("should return the user by ID", async () => {
      const res = await request(app).get(`/api/users/${createdUserId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdUserId);
      expect(res.body.data.email).toBe(testUser.email);
    });
  });

  describe("PATCH /api/users/:id", () => {
    it("should update user details", async () => {
      const updateData = {
        name: "Updated Name",
      };

      const res = await request(app)
        .patch(`/api/users/${createdUserId}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(updateData.name);

      // Verify persistence
      const checkRes = await request(app).get(`/api/users/${createdUserId}`);
      expect(checkRes.body.data.name).toBe(updateData.name);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete the user", async () => {
      const res = await request(app).delete(`/api/users/${createdUserId}`);

      expect(res.status).toBe(200); // 200 or 204 depending on implementation

      // Verify deletion
      const checkRes = await request(app).get(`/api/users/${createdUserId}`);
      expect(checkRes.status).toBe(404);
    });
  });
});
