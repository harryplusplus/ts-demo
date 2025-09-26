import { DataSourceOptions } from "typeorm";
import { NamingStrategy } from "./naming-strategy";

export function getBaseConfig() {
  return {
    type: "postgres",
    entities: [
      process.env.NODE_ENV === "production"
        ? "dist/**/*.entity.js"
        : "src/**/*.entity.ts",
    ],
    migrations: [
      process.env.NODE_ENV === "production"
        ? "dist/migrations/*.js"
        : "src/migrations/*.ts",
    ],
    namingStrategy: new NamingStrategy(),
    logging: process.env.NODE_ENV === "production" ? ["error", "warn"] : "all",
    useUTC: true,
  } satisfies DataSourceOptions;
}

export function getAppConfig() {
  const { DATABASE_URL } = process.env;
  if (!DATABASE_URL) {
    throw new Error("Invalid DATABASE_URL.");
  }

  return {
    ...getBaseConfig(),
    url: DATABASE_URL,
  } satisfies DataSourceOptions;
}
