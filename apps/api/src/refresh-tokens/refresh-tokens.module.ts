import { Module } from "@nestjs/common";
import { RefreshTokensController } from "./refresh-tokens.controller";

@Module({
  controllers: [RefreshTokensController],
})
export class RefreshTokensModule {}
