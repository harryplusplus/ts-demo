import { DB } from "@/db";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterKysely } from "@nestjs-cls/transactional-adapter-kysely";
import { Module } from "@nestjs/common";
import { CamelCasePlugin, PostgresDialect } from "kysely";
import { ClsModule, ClsPlugin } from "nestjs-cls";
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";
import { KYSELY_MODULE_CONNECTION_TOKEN, KyselyModule } from "nestjs-kysely";
import { Pool } from "pg";
import { PG_POOL, PgModule } from "./pg.module";
import { RefreshTokensModule } from "./refresh-tokens/refresh-tokens.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    PgModule,
    KyselyModule.forRootAsync({
      imports: [PgModule],
      inject: [PG_POOL],
      useFactory: (pool: Pool) => ({
        dialect: new PostgresDialect({
          pool,
        }),
        plugins: [new CamelCasePlugin()],
      }),
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      plugins: [
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        new ClsPluginTransactional({
          imports: [KyselyModule],
          adapter: new TransactionalAdapterKysely<DB>({
            kyselyInstanceToken: KYSELY_MODULE_CONNECTION_TOKEN(),
          }),
        }) as ClsPlugin,
      ],
    }),
    UsersModule,
    RefreshTokensModule,
  ],
})
export class AppModule {}
