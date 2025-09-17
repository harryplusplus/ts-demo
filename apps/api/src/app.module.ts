import { Module } from "@nestjs/common";
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";
import { DbModule } from "./db/db.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [GracefulShutdownModule.forRoot(), DbModule, UserModule],
})
export class AppModule {}
