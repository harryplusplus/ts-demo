import { AuthModule } from "@/auth/auth.module";
import { JwtAccessAuthGuard } from "@/auth/jwt-access-auth.guard";
import mikroOrmConfig from "@/mikro-orm.config";
import { RefreshTokensModule } from "@/refresh-tokens/refresh-tokens.module";
import { UsersModule } from "@/users/users.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    MikroOrmModule.forRoot(mikroOrmConfig),
    UsersModule,
    RefreshTokensModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessAuthGuard,
    },
  ],
})
export class AppModule {}
