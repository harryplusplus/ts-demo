import { Module } from "@nestjs/common";
import { PaddleService } from "./paddle.service.js";

@Module({
  providers: [PaddleService],
  exports: [PaddleService],
})
export class PaddleModule {}
