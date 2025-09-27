import { proxyActivities } from "@temporalio/workflow";

import type * as activities from "./activities";

const { greet } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
});

export async function example(name: string): Promise<string> {
  console.log("@");
  const res = await greet(name);
  console.log("@@");
  return res;
}
