import { RefreshTokensModule } from "@/refresh-tokens/refresh-tokens.module";
import { UsersModule } from "@/users/users.module";
import { Module } from "@nestjs/common";
import { AuthHashService } from "./auth-hash.service";
import { AuthJwtService } from "./auth-jwt.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [UsersModule, RefreshTokensModule],
  controllers: [AuthController],
  providers: [AuthService, AuthJwtService, AuthHashService],
})
export class AuthModule {}
