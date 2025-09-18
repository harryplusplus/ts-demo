import { Module } from "@nestjs/common";
import { Pool } from "pg";

export const PG_POOL = "pgPool";

@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: () =>
        new Pool({
          connectionString: process.env.DATABASE_URL,
        }),
    },
  ],
  exports: [PG_POOL],
})
export class PgModule {}
