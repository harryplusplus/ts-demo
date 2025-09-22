import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthJwtService } from "./auth-jwt.service.js";
import { getJwtSecret } from "./auth-utils.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { JwtAccessStrategy } from "./jwt-access.strategy.js";
import { JwtRefreshStrategy } from "./jwt-refresh.strategy.js";
import { LocalStrategy } from "./local.strategy.js";
import { PasswordHashService } from "./password-hash.service.js";

@Module({
  imports: [
    JwtModule.register({
      secret: getJwtSecret(),
      signOptions: {
        issuer: "ts-demo-api",
      },
    }),
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
