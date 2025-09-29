import { defineConfig, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SoftDeleteHandler } from "mikro-orm-soft-delete";

export type Options = Parameters<typeof defineConfig>[0];

export function getBaseConfig(): Options {
  return {
    entities: ["dist/**/*.entity.js"],
    entitiesTs: ["src/**/*.entity.ts"],
    extensions: [SoftDeleteHandler],
  };
}

export function getAppConfig(): Options {
  const { DATABASE_URL } = process.env;
  if (!DATABASE_URL) {
    throw new Error("Invalid DATABASE_URL.");
  }

  return {
    ...getBaseConfig(),
    clientUrl: DATABASE_URL,
    driver: PostgreSqlDriver,
  };
}
