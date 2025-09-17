import { Module } from "@nestjs/common";
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";
import { DbModule } from "./db/db.module";

@Module({
  imports: [GracefulShutdownModule.forRoot(), DbModule],
})
export class AppModule {}
