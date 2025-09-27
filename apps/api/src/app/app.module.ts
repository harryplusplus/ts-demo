import { AuthModule } from "@/auth/auth.module";
import { JwtAccessAuthGuard } from "@/auth/jwt-access-auth.guard";
import { DbModule } from "@/db/db.module";
import { RefreshTokenModule } from "@/refresh-token/refresh-token.module";
import { UserModule } from "@/user/user.module";
import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    DbModule,
    UserModule,
    RefreshTokenModule,
    AuthModule,
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
