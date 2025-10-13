import { defineConfig } from "@mikro-orm/postgresql";
import { getConfigBase } from "./db/config.js";

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  throw new Error("Invalid DATABASE_URL.");
}

export default defineConfig({
  ...getConfigBase(),
  clientUrl: DATABASE_URL,
});
