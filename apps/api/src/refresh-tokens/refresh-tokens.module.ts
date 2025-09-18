import { Module } from "@nestjs/common";
import { RefreshTokensController } from "./refresh-tokens.controller";
import { RefreshTokensRepository } from "./refresh-tokens.repository";

@Module({
  controllers: [RefreshTokensController],
  providers: [RefreshTokensRepository],
  exports: [RefreshTokensRepository],
})
export class RefreshTokensModule {}
