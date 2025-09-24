import "dotenv/config";

import { DataSourceOptions } from "typeorm";
import { NamingStrategy } from "./naming-strategy";

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  throw new Error("Invalid DATABASE_URL.");
}

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  url: DATABASE_URL,
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/migrations/*.js"],
  namingStrategy: new NamingStrategy(),
  logging: process.env.NODE_ENV !== "production" ? "all" : ["error", "warn"],
  useUTC: true,
};
