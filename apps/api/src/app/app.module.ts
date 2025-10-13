import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";
import { AuthModule } from "../auth/auth.module.js";
import { JwtAccessAuthGuard } from "../auth/jwt-access-auth.guard.js";
import { PaddleModule } from "../paddle/paddle.module.js";
import { RefreshTokenModule } from "../refresh-token/refresh-token.module.js";
import { UserModule } from "../user/user.module.js";

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    MikroOrmModule.forRoot(),
    UserModule,
    RefreshTokenModule,
    AuthModule,
    PaddleModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessAuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
