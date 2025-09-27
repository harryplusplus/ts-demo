import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs"],
  sourcemap: true,
  entry: ["src/index.ts"],
  onSuccess: "tsc",
});
