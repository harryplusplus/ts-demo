import { Module } from "@nestjs/common";
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";
import { DbModule } from "./db/db.module";
import { RefreshTokenModule } from "./refresh-token/refresh-token.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    DbModule,
    UserModule,
    RefreshTokenModule,
  ],
})
export class AppModule {}
