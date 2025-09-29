import {
  AbstractSqlDriver,
  PostgreSqlPlatform,
  type Configuration,
} from "@mikro-orm/postgresql";
import { PGliteSqlConnection } from "./mikro-orm-pglite-sql-connection";

export class PGliteSqlDriver extends AbstractSqlDriver<PGliteSqlConnection> {
  constructor(config: Configuration) {
    super(config, new PostgreSqlPlatform(), PGliteSqlConnection, [
      "knex",
      "pg",
    ]);
  }
}
