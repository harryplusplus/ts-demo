import { getBaseConfig } from "@/db/config";
import { MikroORM } from "mikro-orm-pglite";
import { Constructor } from "type-fest";

export async function initOrm(): Promise<MikroORM> {
  const orm = await MikroORM.init({
    ...getBaseConfig(),
    dbName: "test-db",
    migrations: { pathTs: "src/migrations" },
    preferTs: true,
    debug: true,
  });
  await orm.migrator.up();
  return orm;
}

export function expectAny<T>(constructor: Constructor<T>): T {
  return expect.any(constructor) as T;
}
