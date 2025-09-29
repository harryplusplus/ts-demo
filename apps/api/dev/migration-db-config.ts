import { defineConfig } from "@mikro-orm/postgresql";
import { createMigrationGeneratorClass } from "mikro-orm-pg-migration-generator";
import { format } from "sql-formatter";
import { getAppConfig } from "../src/db/config";

const BaseMigrationGenerator = createMigrationGeneratorClass();

class CustomMigrationGenerator extends BaseMigrationGenerator {
  override createStatement(sql: string, padLeft: number): string {
    sql = format(sql, { language: "postgresql" });
    sql = `\n${sql}\n`;
    return super.createStatement(sql, padLeft);
  }
}

export default defineConfig({
  ...getAppConfig(),
  migrations: { generator: CustomMigrationGenerator },
});
