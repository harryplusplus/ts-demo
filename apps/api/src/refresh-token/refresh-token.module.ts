import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshTokenSchema } from "./refresh-token.entity";
import { RefreshTokenService } from "./refresh-token.service";

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenSchema])],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
