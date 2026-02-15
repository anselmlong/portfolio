// test-intent.ts
import { config } from "dotenv";
config({ path: ".env" });

import { detectIntent } from "./intent";

async function test() {
  console.log(await detectIntent("When are you free next week?"));
  console.log(await detectIntent("Tell me about your projects"));
}

test();
