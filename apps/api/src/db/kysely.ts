import { DB } from "@/db";
import { Injectable } from "@nestjs/common";
import { CamelCasePlugin, Kysely as KyselyBase, PostgresDialect } from "kysely";
import { PgPool } from "./pg-pool";

@Injectable()
export class Kysely extends KyselyBase<DB> {
  constructor(private readonly pgPool: PgPool) {
    super({
      dialect: new PostgresDialect({
        pool: pgPool,
      }),
      plugins: [new CamelCasePlugin()],
    });
  }
}
