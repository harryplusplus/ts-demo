import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  onSuccess: "tsc",
  swc: true,
  clean: true,
});
