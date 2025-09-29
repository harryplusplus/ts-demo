import { defineConfig } from "@mikro-orm/postgresql";
import { createMigrationGeneratorClass } from "mikro-orm-pg-migration-generator";
import { format } from "sql-formatter";

const BaseMigrationGenerator = createMigrationGeneratorClass();

class CustomMigrationGenerator extends BaseMigrationGenerator {
  override createStatement(sql: string, padLeft: number): string {
    sql = format(sql, { language: "postgresql" });
    sql = `\n${sql}\n`;
    return super.createStatement(sql, padLeft);
  }
}

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  throw new Error("Invalid DATABASE_URL.");
}

export default defineConfig({
  clientUrl: DATABASE_URL,
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  migrations: { generator: CustomMigrationGenerator },
});
