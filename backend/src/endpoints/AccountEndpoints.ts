/**
 * @fileoverview Account Management Endpoints
 */

import type { Request, Response } from "express";
import { Router } from "express";
import { matchedData } from "express-validator";

import { plaid } from "../plaid/Plaid";
import {
  validate,
  countryCodeValidator,
  productValidator,
} from "./InputValidators";

const router = Router();

// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#create-link-token
router.post(
  "/create_user_token",
  [countryCodeValidator, productValidator],
  validate,
  (req: Request, resp: Response) => {
    const data = matchedData(req);
    const res = plaid().createLinkToken(data["countryCodes"], data["products"]);
    if (res) {
      resp.json(res);
    } else {
      // Don't show internal error
      resp.status(503);
      resp.json({
        error: "Service unavailable at the moment. Please try again later.",
      });
    }
  },
);

// // Exchange token flow - exchange a Link public_token for
// // an API access_token
// // https://plaid.com/docs/#exchange-token-flow
// app.post("/api/set_access_token", function (request, response, next) {
//   PUBLIC_TOKEN = request.body.public_token;
//   Promise.resolve()
//     .then(async function () {
//       const tokenResponse = await client.itemPublicTokenExchange({
//         public_token: PUBLIC_TOKEN,
//       });
//       prettyPrintResponse(tokenResponse);
//       ACCESS_TOKEN = tokenResponse.data.access_token;
//       ITEM_ID = tokenResponse.data.item_id;
//       response.json({
//         // the 'access_token' is a private token, DO NOT pass this token to the frontend in your production environment
//         access_token: ACCESS_TOKEN,
//         item_id: ITEM_ID,
//         error: null,
//       });
//     })
//     .catch(next);
// });

export { router };
