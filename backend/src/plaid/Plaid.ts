/**
 * @fileoverview Manage all Plaid related API calls.
 */

// Setup plaid connection
// Register products
// Convert plaid results to table row objects

// Each extension will register its own products
// Make whatever API calls it needs

import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import type {
  CountryCode,
  LinkTokenCreateRequest,
  LinkTokenCreateResponse,
  Products,
} from "plaid";
import type { AxiosResponse, AxiosError } from "axios";
import { isAxiosError } from "axios";
import { datastore } from "../datastore/Datastore.ts";
import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: { service: "plaid" },
  transports: [new transports.Console()],
});

/**
 * Singleton class for abstracting Plaid API interfaces. It is also responsible
 * for getting new link tokens, reusing previously established permanent tokens.
 */
class Plaid {
  private static readonly APP_NAME = "Stash";
  private static readonly PLAID_VERSION = "2020-09-14";

  private client: PlaidApi;

  public static getPlaidConfiguration(): Configuration {
    const PLAID_CLIENT_ID = process.env["PLAID_CLIENT_ID"];
    const PLAID_SECRET = process.env["PLAID_SECRET"];
    const PLAID_ENV = process.env["PLAID_ENV"];
    if (!PLAID_CLIENT_ID || !PLAID_SECRET || !PLAID_ENV) {
      throw new Error("PLAID CLIENT_ID or SECRET or ENV not defined.");
    }
    let basePath = PlaidEnvironments[PLAID_ENV];
    if (!basePath) {
      throw new Error(`Invalid environment value ${PLAID_ENV}`);
    }
    return new Configuration({
      basePath: basePath,
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
          "PLAID-SECRET": PLAID_SECRET,
          "Plaid-Version": Plaid.PLAID_VERSION,
        },
      },
    });
  }

  public constructor(configuration: Configuration) {
    this.client = new PlaidApi(configuration);
  }

  /**
   * Get a link token to be used such that users can start a link process for
   * the associated products configured for this link token.
   *
   * @param countryCodes: List of plaid-supported country codes. See
   * https://plaid.com/docs/api/link/#link-token-create-request-products
   * @param products: Type of product the user wishes to register for under their
   * Plaid account
   * @returns A successful link token or null if plaid request failed.
   */
  public async createLinkToken(
    countryCodes: CountryCode[],
    products: Products[],
  ): Promise<LinkTokenCreateResponse | null> {
    const userId = datastore().getUserId();
    const configs: LinkTokenCreateRequest = {
      client_name: Plaid.APP_NAME,
      language: datastore().getPlaidLanguage(),
      country_codes: countryCodes,
      user: {
        client_user_id: userId,
      },
      products: products,
    };
    const res = await this.withRetry(() => {
      return this.client.linkTokenCreate(configs);
    });
    if (isAxiosError(res)) {
      return null;
    } else {
      // Must be success
      return res;
    }
  }

  /**
   * Exchanges a public access token received after completing the link process
   * for a permanent token is used to access the products that the user has
   * completed the link process for.
   *
   * @param publicToken Token received upon completing Plaid flow
   */
  public exchangePublicToken(): void {}

  /**
   * Helper function for retrying plaid calls
   *
   * @param fn a thin wrapper call over a plaid api call. It is expected to
   * return either an AxiosResponse or an AxiosError. Any other errors will
   * be immediately rethrown.
   * @param retriesLeft number of retries to make for an api call
   * @param interval time (ms) to wait between retries
   * @return a successful axios response or the last failed axios response
   */
  private async withRetry<T>(
    fn: () => Promise<AxiosResponse<T>>,
    retriesLeft: number = 3,
    interval: number = 300,
  ): Promise<T | AxiosError> {
    if (process.env["PLAID_ENV"] == "sandbox") {
      // In test mode, don't bother with retries.
      retriesLeft = 0;
    }
    try {
      const resp = await fn();
      return resp.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorResponse = error.response ? error.response.data : null;
        logger.info("withRetry failed", [error.request.path, errorResponse]);
        if (retriesLeft == 0) {
          return error;
        }
      } else {
        logger.info("withRetry failed", error);
        if (retriesLeft == 0) {
          throw error;
        }
      }

      // Wait for the specified interval before the next attempt
      await new Promise((resolve) => setTimeout(resolve, interval));
      return this.withRetry(fn, retriesLeft - 1, interval);
    }
  }
}

const plaid = () => {
  if (!plaidVariable) {
    plaidVariable = new Plaid(Plaid.getPlaidConfiguration());
    logger.info("Plaid service succesfully started.");
  }
  return plaidVariable;
};

const resetPlaidTestOnly = () => {
  plaidVariable = null;
};

// Lazy setup our singleton so that our test files can at least import the module
let plaidVariable: Plaid | null = null;

// // We store the access_token in memory - in production, store it in a secure
// // persistent data store
// let ACCESS_TOKEN = null;
// let USER_TOKEN = null;
// let PUBLIC_TOKEN = null;
// let ITEM_ID = null;
// let ACCOUNT_ID = null;
// // The payment_id is only relevant for the UK/EU Payment Initiation product.
// // We store the payment_id in memory - in production, store it in a secure
// // persistent data store along with the Payment metadata, such as userId .
// let PAYMENT_ID = null;
// // The transfer_id and authorization_id are only relevant for Transfer ACH product.
// // We store the transfer_id in memory - in production, store it in a secure
// // persistent data store
// let AUTHORIZATION_ID = null;
// let TRANSFER_ID = null;

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
// app.get("/api/transactions", function (request, response, next) {
//   Promise.resolve()
//     .then(async function () {
//       // Set cursor to empty to receive all historical updates
//       let cursor = null;

//       // New transaction updates since "cursor"
//       let added = [];
//       let modified = [];
//       // Removed transaction ids
//       let removed = [];
//       let hasMore = true;
//       // Iterate through each page of new transaction updates for item
//       while (hasMore) {
//         const request = {
//           access_token: ACCESS_TOKEN,
//           cursor: cursor,
//         };
//         const response = await client.transactionsSync(request);
//         const data = response.data;

//         // If no transactions are available yet, wait and poll the endpoint.
//         // Normally, we would listen for a webhook, but the Quickstart doesn't
//         // support webhooks. For a webhook example, see
//         // https://github.com/plaid/tutorial-resources or
//         // https://github.com/plaid/pattern
//         cursor = data.next_cursor;
//         if (cursor === "") {
//           await sleep(2000);
//           continue;
//         }

//         // Add this page of results
//         added = added.concat(data.added);
//         modified = modified.concat(data.modified);
//         removed = removed.concat(data.removed);
//         hasMore = data.has_more;

//         prettyPrintResponse(response);
//       }

//       const compareTxnsByDateAscending = (a, b) =>
//         (a.date > b.date) - (a.date < b.date);
//       // Return the 8 most recent transactions
//       const recently_added = [...added]
//         .sort(compareTxnsByDateAscending)
//         .slice(-8);
//       response.json({ latest_transactions: recently_added });
//     })
//     .catch(next);
// });

export { plaid, resetPlaidTestOnly };
