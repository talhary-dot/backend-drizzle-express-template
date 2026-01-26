import { defineConfig } from "vitest/config";
import process from "node:process";

try {
  process.loadEnvFile();
} catch (error) {
  // Silent fail if no .env file
}

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
    },
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
  },
});
