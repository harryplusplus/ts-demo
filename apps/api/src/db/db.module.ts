import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addTransactionalDataSource } from "typeorm-transactional";
import { dataSourceOptions } from "./data-source-options";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({ ...dataSourceOptions }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error("Invalid options.");
        }

        await Promise.resolve();
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
  ],
})
export class DbModule {}
