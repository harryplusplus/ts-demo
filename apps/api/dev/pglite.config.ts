import { TSMigrationGenerator } from "@mikro-orm/migrations";
import { defineConfig } from "mikro-orm-pglite";
import { format } from "sql-formatter";
import { getConfigBase } from "../src/db/config.js";

class CustomMigrationGenerator extends TSMigrationGenerator {
  override createStatement(sql: string, padLeft: number): string {
    if (sql) {
      sql = format(sql, { language: "postgresql" });
      sql = `\n${sql}\n`;
      const padding = " ".repeat(padLeft);
      return `${padding}this.addSql(/* sql */ \`${sql.replace(
        /[`$\\]/g,
        "\\$&"
      )}\`);\n`;
    }

    return "\n";
  }
}

export default defineConfig({
  ...getConfigBase(),
  dbName: "postgres",
  migrations: {
    generator: CustomMigrationGenerator,
    snapshot: false,
    pathTs: "src/migrations",
  },
  preferTs: true,
  dynamicImportProvider: (id) => import(id),
});
