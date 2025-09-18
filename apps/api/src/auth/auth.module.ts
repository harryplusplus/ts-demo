import { RefreshTokensModule } from "@/refresh-tokens/refresh-tokens.module";
import { UsersModule } from "@/users/users.module";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [UsersModule, RefreshTokensModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
