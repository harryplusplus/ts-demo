import { MikroORM } from "mikro-orm-pglite";
import config from "./pglite.config.js";

async function main() {
  const orm = await MikroORM.init(config);
  try {
    await orm.migrator.up();
    await orm.migrator.createMigration();
  } finally {
    await orm.close();
  }
}

main()
  .then(() => process.exit())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
