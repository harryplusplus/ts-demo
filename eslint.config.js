import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import ts from "typescript-eslint";

export default defineConfig([
  {
    files: ["apps/*/src/**/*.ts", "packages/*/src/**/*.ts"],
    ignores: ["**/*.d.ts", "apps/api/src/migrations/**/*.ts"],
    plugins: { js, ts },
    extends: ["js/recommended", "ts/recommendedTypeChecked"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
]);
