import { DbModule } from "@/db/db.module";
import { Module } from "@nestjs/common";
import { RefreshTokenController } from "./refresh-token.controller";

@Module({
  imports: [DbModule],
  controllers: [RefreshTokenController],
})
export class RefreshTokenModule {}
