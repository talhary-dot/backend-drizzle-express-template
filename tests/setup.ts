import { beforeAll } from "vitest";

beforeAll(() => {
  try {
    process.loadEnvFile();
  } catch (e) {
    console.warn("No .env file found, or failed to load it.");
  }
});
