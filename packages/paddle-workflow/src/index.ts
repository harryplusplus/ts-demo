import { proxyActivities } from "@temporalio/workflow";

export function hello() {
  console.log(proxyActivities);
  console.log("Hello");
}
