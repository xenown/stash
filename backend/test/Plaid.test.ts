import "mocha";
import * as assert from "node:assert/strict";
import { plaid } from "../src/plaid/Plaid.ts";

describe("Plaid Setup", () => {
  it("should fail with no process setup", () => {
    assert.throws(() => {
      plaid();
    }, "bad");
  });
});
