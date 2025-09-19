import "dotenv/config";
import "source-map-support/register";

import { AppModule } from "@/app/app.module";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import express from "express";
import { setupGracefulShutdown } from "nestjs-graceful-shutdown";
import { cleanupOpenApiDoc } from "nestjs-zod";

async function bootstrap() {
  const expressInstance = express();
  expressInstance.set("trust proxy", true);

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance)
  );

  setupGracefulShutdown({ app });

  if (process.env.NODE_ENV !== "production") {
    SwaggerModule.setup("/openapi", app, () =>
      cleanupOpenApiDoc(
        SwaggerModule.createDocument(
          app,
          new DocumentBuilder()
            .setTitle("TypeScript Demo API")
            .setVersion("1.0")
            .setOpenAPIVersion("3.0.0")
            .build()
        )
      )
    );
  }

  await app.listen(3000);
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
