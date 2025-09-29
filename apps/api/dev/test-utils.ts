import { getBaseConfig } from "@/db/config";
import { MikroORM, Options } from "@mikro-orm/postgresql";
import { PGliteSqlDriver } from "./mikro-orm-pglite";

export async function initOrm(): Promise<MikroORM> {
  const config: Options = {
    ...getBaseConfig(),

    driver: PGliteSqlDriver,
    dbName: "postgres",

    migrations: { pathTs: "src/migrations" },
    preferTs: true,
  };
  const orm = await MikroORM.init(config);
  await orm.migrator.up();
  return orm;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function expectAny<T>(constructor: new (...args: any[]) => T): T {
  return expect.any(constructor) as T;
}
