import "dotenv/config";

import { execFileSync } from "node:child_process";

function main() {
  execFileSync("flyway", ["version"]);

  const { host, pathname, username, password } = new URL(
    process.env.DATABASE_URL ?? ""
  );
  const env = {
    ...process.env,
    FLYWAY_USER: username,
    FLYWAY_PASSWORD: password,
  };
  const args = [
    "-configFiles=./flyway.conf",
    `-url=jdbc:postgresql://${host}${pathname}`,
    ...process.argv.slice(2),
  ];

  try {
    execFileSync("flyway", args, { env, stdio: "inherit" });
  } catch (e) {
    if (typeof e == "object" && e && "message" in e) {
      console.error(e.message);
    }
  }
}

main();
