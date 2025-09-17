import "dotenv/config";
import "source-map-support/register";

import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { setupGracefulShutdown } from "nestjs-graceful-shutdown";
import { AppModule } from "./app.module";

async function bootstrap() {
  const expressInstance = express();
  expressInstance.set("trust proxy", true);

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance)
  );
  setupGracefulShutdown({ app });
  app.setGlobalPrefix("/api");

  await app.listen(3000);
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
