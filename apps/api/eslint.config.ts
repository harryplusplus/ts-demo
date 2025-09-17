import { defineConfig } from "eslint/config";
import ts from "typescript-eslint";
import rootConfig from "../../eslint.config";

export default defineConfig([
  ...rootConfig,
  {
    plugins: { ts },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
]);
