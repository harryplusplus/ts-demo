import { defineConfig, ReflectMetadataProvider } from "@mikro-orm/core";
import { Migrator } from "@mikro-orm/migrations";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

type Extension = NonNullable<
  Parameters<typeof defineConfig>[0]["extensions"]
>[0];

export default defineConfig({
  entities: ["dist/**/*.entity.js"],
  dbName: "postgres",
  driver: PostgreSqlDriver,
  metadataProvider: ReflectMetadataProvider,
  extensions: [Migrator as Extension],
  debug: process.env.NODE_ENV !== "production",
});
