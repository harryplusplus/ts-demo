import { getBaseConfig } from "@/db/config";
import { defineConfig } from "@mikro-orm/postgresql";
import { PGliteSqlDriver } from "./mikro-orm-pglite-sql-driver";

export default defineConfig({
  ...getBaseConfig(),
  driver: PGliteSqlDriver,
});
