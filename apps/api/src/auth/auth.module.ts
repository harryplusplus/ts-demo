import { RefreshTokensModule } from "@/refresh-tokens/refresh-tokens.module";
import { UsersModule } from "@/users/users.module";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthJwtService } from "./auth-jwt.service";
import { getJwtSecret } from "./auth-utils";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAccessStrategy } from "./jwt-access.strategy";
import { JwtRefreshStrategy } from "./jwt-refresh.strategy";
import { LocalStrategy } from "./local.strategy";
import { PasswordHashService } from "./password-hash.service";

@Module({
  imports: [
    JwtModule.register({
      secret: getJwtSecret(),
      signOptions: {
        issuer: "ts-demo-api",
      },
    }),
    UsersModule,
    RefreshTokensModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthJwtService,
    PasswordHashService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
