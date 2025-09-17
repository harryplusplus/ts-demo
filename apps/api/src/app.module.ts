import { Module } from "@nestjs/common";
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";

@Module({
  imports: [GracefulShutdownModule.forRoot()],
})
export class AppModule {}
