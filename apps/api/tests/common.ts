import { getBaseConfig } from "@/db/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { PGliteDriver } from "typeorm-pglite";

export async function initDataSource(): Promise<DataSource> {
  const config = {
    ...getBaseConfig(),
    driver: new PGliteDriver({}).driver,
  } satisfies DataSourceOptions;

  const dataSource = new DataSource(config);
  await dataSource.initialize();
  await dataSource.runMigrations();
  return dataSource;
}

export function expectAny<T>(constructor: new (...args: any[]) => T): T {
  return expect.any(constructor) as T;
}
