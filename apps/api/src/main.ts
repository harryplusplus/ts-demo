import "dotenv/config";
import "source-map-support/register";

import { AppModule } from "@/app/app.module";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { setupGracefulShutdown } from "nestjs-graceful-shutdown";
import { cleanupOpenApiDoc } from "nestjs-zod";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  setupGracefulShutdown({ app });
  app.set("trust proxy", "loopback");
  app.use(helmet());

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
