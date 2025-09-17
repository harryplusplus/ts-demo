import { Module } from "@nestjs/common";
import { Kysely } from "./kysely";
import { PgPool } from "./pg-pool";

@Module({
  providers: [PgPool, Kysely],
  exports: [PgPool, Kysely],
})
export class DbModule {}
