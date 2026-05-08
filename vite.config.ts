import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    alias: [
      {
        find: /^.+\.module\.scss$/,
        replacement: path.resolve(__dirname, "./src/test/styleMock.ts"),
      },
    ],
  },
});
