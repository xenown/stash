import "mocha";
import { assert } from "chai";
import { plaid, resetPlaidTestOnly } from "../../src/plaid/Plaid.ts";

describe("Plaid Setup", () => {
  let originalCliendId: string | undefined;
  let originalClientSecret: string | undefined;
  let originalEnv: string | undefined;
  beforeEach(() => {
    resetPlaidTestOnly();
    originalCliendId = process.env["PLAID_CLIENT_ID"];
    originalClientSecret = process.env["PLAID_SECRET"];
    originalEnv = process.env["PLAID_ENV"];
  });

  afterEach(() => {
    process.env["PLAID_CLIENT_ID"] = originalCliendId;
    process.env["PLAID_SECRET"] = originalClientSecret;
    process.env["PLAID_ENV"] = originalEnv;
  });

  it("should fail with no client id", () => {
    delete process.env["PLAID_SECRET"];
    delete process.env["PLAID_ENV"];

    process.env["PLAID_CLIENT_ID"] = "test_id";
    assert.throws(
      () => {
        plaid();
      },
      Error,
      "PLAID CLIENT_ID or SECRET or ENV not defined",
    );
  });

  it("should fail with no plaid secret", () => {
    delete process.env["PLAID_CLIENT_ID"];
    delete process.env["PLAID_ENV"];

    process.env["PLAID_SECRET"] = "test_secret";
    assert.throws(
      () => {
        plaid();
      },
      Error,
      "PLAID CLIENT_ID or SECRET or ENV not defined",
    );
  });

  it("should fail with no plaid env", () => {
    delete process.env["PLAID_CLIENT_ID"];
    delete process.env["PLAID_SECRET"];

    process.env["PLAID_ENV"] = "test_env";
    assert.throws(
      () => {
        plaid();
      },
      Error,
      "PLAID CLIENT_ID or SECRET or ENV not defined",
    );
  });

  it("should verify plaid env", () => {
    process.env["PLAID_CLIENT_ID"] = "test_id";
    process.env["PLAID_SECRET"] = "test_secret";
    process.env["PLAID_ENV"] = "test_env";
    assert.throws(
      () => {
        plaid();
      },
      Error,
      "Invalid environment value test_env",
    );

    process.env["PLAID_ENV"] = "sandbox";
    assert.isNotNull(plaid());

    process.env["PLAID_ENV"] = "production";
    assert.isNotNull(plaid());
  });
});
