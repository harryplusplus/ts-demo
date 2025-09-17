import { Module } from "@nestjs/common";
import { KyselyDb } from "./kysely-db";
import { PgPool } from "./pg-pool";

@Module({
  providers: [PgPool, KyselyDb],
  exports: [PgPool, KyselyDb],
})
export class DbModule {}
