import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { RefreshToken } from "./refresh-token.entity.js";
import { RefreshTokenService } from "./refresh-token.service.js";

@Module({
  imports: [MikroOrmModule.forFeature([RefreshToken])],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
