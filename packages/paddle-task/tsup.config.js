import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  sourcemap: true,
  entry: ["./src/index.ts"],
  onSuccess: "tsc",
});
