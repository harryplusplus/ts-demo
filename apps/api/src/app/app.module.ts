import { AuthModule } from "@/auth/auth.module";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { PG_POOL, PgModule } from "@/pg/pg.module";
import { RefreshTokensModule } from "@/refresh-tokens/refresh-tokens.module";
import { DB } from "@/types/db";
import { UsersModule } from "@/users/users.module";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterKysely } from "@nestjs-cls/transactional-adapter-kysely";
import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { CamelCasePlugin, PostgresDialect } from "kysely";
import { ClsModule } from "nestjs-cls";
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";
import { KYSELY_MODULE_CONNECTION_TOKEN, KyselyModule } from "nestjs-kysely";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";
import { Pool } from "pg";

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
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
