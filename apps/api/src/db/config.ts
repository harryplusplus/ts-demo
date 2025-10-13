import { defineConfig } from "@mikro-orm/postgresql";
import { SoftDeleteHandler } from "mikro-orm-soft-delete";

export type Options = NonNullable<Parameters<typeof defineConfig>[0]>;

export function getConfigBase(): Options {
  return {
    entities: ["dist/**/*.entity.js"],
    entitiesTs: ["src/**/*.entity.ts"],
    extensions: [SoftDeleteHandler],
  };
}
