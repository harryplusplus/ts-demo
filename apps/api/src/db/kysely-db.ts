import { DB } from "@/db";
import { Injectable } from "@nestjs/common";
import { Kysely, PostgresDialect } from "kysely";
import { PgPool } from "./pg-pool";

@Injectable()
export class KyselyDb extends Kysely<DB> {
  constructor(private readonly pgPool: PgPool) {
    super({
      dialect: new PostgresDialect({
        pool: pgPool,
      }),
    });
  }
}
