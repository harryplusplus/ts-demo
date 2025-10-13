import { MikroORM } from "mikro-orm-pglite";
import config from "../dev/pglite.config.js";

export async function initOrm() {
  const orm = await MikroORM.init(config);
  await orm.migrator.up();
  return orm;
}
