import "mocha";
import { assert } from "chai";
import { plaid, resetPlaidTestOnly } from "../../src/plaid/Plaid.ts";
import { CountryCode, Products } from "plaid";

describe("Plaid Token Creation", () => {
  let originalCliendId: string | undefined;
  let originalClientSecret: string | undefined;
  beforeEach(() => {
    resetPlaidTestOnly();
    originalCliendId = process.env["PLAID_CLIENT_ID"];
    originalClientSecret = process.env["PLAID_SECRET"];
    // Never use production mode in tests
    process.env["PLAID_ENV"] = "sandbox";
  });

  afterEach(() => {
    process.env["PLAID_CLIENT_ID"] = originalCliendId;
    process.env["PLAID_SECRET"] = originalClientSecret;
  });

  it("should fail with invalid client key", async () => {
    process.env["PLAID_CLIENT_ID"] = "test_id";
    const plaidInstance = plaid();
    const res = await plaidInstance.createLinkToken(
      [CountryCode.Us],
      [Products.Assets],
    );
    assert.isNull(res);
  });

  it("should fail with invalid client secret", async () => {
    process.env["PLAID_SECRET"] = "test_secret";
    const plaidInstance = plaid();
    const res = await plaidInstance.createLinkToken(
      [CountryCode.Us],
      [Products.Assets],
    );
    assert.isNull(res);
  });

  it("should be allowed to set up transactions", async () => {
    const plaidInstance = plaid();
    const res = await plaidInstance.createLinkToken(
      [CountryCode.Us],
      [Products.Transactions],
    );
    assert.isNotNull(res);
  });
});
