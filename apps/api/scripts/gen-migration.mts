import { execSync } from "node:child_process";

const args = process.argv.slice(2);
const arg0 = args[0];
if (!arg0) {
  console.error("Please input a migration name.");
  console.error("For example: pnpm migration:generate foo");
  process.exit(1);
}

execSync(
  `pnpm typeorm-ts-node-commonjs migration:generate src/migrations/${arg0} -p -d src/db/migration-datasource.ts`,
  { stdio: "inherit" }
);
