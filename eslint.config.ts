import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import ts from "typescript-eslint";

export default defineConfig([
  {
    files: ["apps/*/src/**/*.ts", "libs/*/src/**/*.ts"],
    ignores: ["**/*.d.ts"],
    plugins: { js, ts },
    extends: ["js/recommended", "ts/recommendedTypeChecked"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-import-type": [
        "error",
        {
          selector: "ImportDeclaration[importKind='type']",
          message: "Do not use import type. Use regular import instead.",
        },
      ],
    },
  },
]);
