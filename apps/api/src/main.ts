import "dotenv/config";
import "source-map-support/register";

import { AppModule } from "@/app/app.module";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { setupGracefulShutdown } from "nestjs-graceful-shutdown";
import { cleanupOpenApiDoc } from "nestjs-zod";
import {
  initializeTransactionalContext,
  StorageDriver,
} from "typeorm-transactional";

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});

async function bootstrap() {
  checkUtc();
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  setupGracefulShutdown({ app });
  app.set("trust proxy", "loopback");
  app.use(helmet());

  if (process.env.NODE_ENV !== "production") {
    await setupSwagger(app);
  }

  await app.listen(3000);
}

function checkUtc() {
  const offset = new Date().getTimezoneOffset();
  if (offset === 0) {
    return;
  }

  throw new Error(
    `TimeZone must be UTC. Current offset(hours): ${offset / 60}`
  );
}

async function setupSwagger(app: NestExpressApplication) {
  const { DocumentBuilder, SwaggerModule } = await import("@nestjs/swagger");
  const metadata = await import("./metadata");
  await SwaggerModule.loadPluginMetadata(metadata.default);
  SwaggerModule.setup(
    "/api",
    app,
    () =>
      cleanupOpenApiDoc(
        SwaggerModule.createDocument(
          app,
          new DocumentBuilder()
            .setTitle("TypeScript Demo API")
            .setVersion("1.0")
            .setOpenAPIVersion("3.1.1")
            .addBearerAuth(
              {
                type: "http",
                scheme: "Bearer",
                bearerFormat: "JWT",
                in: "header",
                name: "Authorization",
              },
              "access-token"
            )
            .build()
        )
      ),
    {
      swaggerOptions: {
        persistAuthorization: true,
      },
    }
  );
}
