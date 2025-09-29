import { PostgreSqlConnection } from "@mikro-orm/postgresql";
import ClientPGlite from "knex-pglite";

export class PGliteSqlConnection extends PostgreSqlConnection {
  override createKnex() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    this.client = this.createKnexClient(ClientPGlite as any);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.client.client.ormConfig = this.config;
    this.connected = true;
  }
}
