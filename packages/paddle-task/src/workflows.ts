import { ActivityFunction, proxyActivities } from "@temporalio/workflow";

import type * as activities from "./activities";

interface GreetInput {
  a: true;
}

interface GreetOutput {
  a: true;
}

interface Greet3 {
  // v1
  (input: GreetInput): Promise<GreetOutput>;
}

interface MyGreetInput {
  a: false;
}

interface Greet3 extends ActivityFunction<[MyGreetInput], GreetOutput> {
  // v2
  (input: MyGreetInput): Promise<GreetOutput>;
}

const greet4: Greet3 = (input) => {
  console.log("greet4", input);
  return Promise.resolve({ a: true });
};

interface MyActivities {
  greet4: Greet3;
}

const myActivities: MyActivities = {
  greet4,
};

const res = proxyActivities<MyActivities>({});

const { greet } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
});

export async function example(name: string): Promise<string> {
  console.log("@");
  const res = await greet(name);
  console.log("@@");
  return res;
}

export interface DoWorkflow {
  (input: string): Promise<string>;
}

export const DO_WORKFLOW = "do-workflow";
