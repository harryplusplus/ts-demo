import { AuthModule } from "@/auth/auth.module";
import { DB } from "@/db";
import { PG_POOL, PgModule } from "@/pg/pg.module";
import { RefreshTokensModule } from "@/refresh-tokens/refresh-tokens.module";
import { UsersModule } from "@/users/users.module";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterKysely } from "@nestjs-cls/transactional-adapter-kysely";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CamelCasePlugin, PostgresDialect } from "kysely";
import { ClsModule } from "nestjs-cls";
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";
import { KYSELY_MODULE_CONNECTION_TOKEN, KyselyModule } from "nestjs-kysely";
import { Pool } from "pg";

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    JwtModule.register({
      global: true,
      secret:
        process.env.JWT_SECRET ??
        (() => {
          throw new Error("Invalid JWT_SECRET.");
        })(),
      signOptions: {
        issuer: "api",
      },
    }),
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
        new ClsPluginTransactional({
          imports: [KyselyModule],
          adapter: new TransactionalAdapterKysely<DB>({
            kyselyInstanceToken: KYSELY_MODULE_CONNECTION_TOKEN(),
          }),
          enableTransactionProxy: true,
        }),
      ],
    }),
    UsersModule,
    RefreshTokensModule,
    AuthModule,
  ],
})
export class AppModule {}
