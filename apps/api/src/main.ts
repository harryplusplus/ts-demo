import "source-map-support/register";

import { NestFactory } from "@nestjs/core";
import { setupGracefulShutdown } from "nestjs-graceful-shutdown";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupGracefulShutdown({ app });
  await app.listen(3000);
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
