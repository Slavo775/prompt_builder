import {defineConfig} from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    setupFiles: ["./apps/builder/src/__tests__/setup.ts"],
    globals: true,
  },
});

