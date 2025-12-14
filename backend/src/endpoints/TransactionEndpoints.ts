/**
 * @fileoverview Transaction Fetching Endpoints
 */

import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

const router = Router();

// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#create-link-token
router.post(
  "/create_user_token",
  (req: Request, res: Response, next: NextFunction) => {},
);

// // Create a user token which can be used for Plaid Check, Income, or Multi-Item link flows
// // https://plaid.com/docs/api/users/#usercreate
// app.post("/api/create_user_token", function (request, response, next) {
//   Promise.resolve()
//     .then(async function () {
//       const request = {
//         // Typically this will be a user ID number from your application.
//         client_user_id: "user_" + uuidv4(),
//       };

//       if (PLAID_PRODUCTS.some((product) => product.startsWith("cra_"))) {
//         request.consumer_report_user_identity = {
//           date_of_birth: "1980-07-31",
//           first_name: "Harry",
//           last_name: "Potter",
//           phone_numbers: ["+16174567890"],
//           emails: ["harrypotter@example.com"],
//           primary_address: {
//             city: "New York",
//             region: "NY",
//             street: "4 Privet Drive",
//             postal_code: "11111",
//             country: "US",
//           },
//         };
//       }
//       const user = await client.userCreate(request);
//       USER_TOKEN = user.data.user_token;
//       response.json(user.data);
//     })
//     .catch(next);
// });

// app.post("/api/info", function (request, response, next) {
//   response.json({
//     item_id: ITEM_ID,
//     access_token: ACCESS_TOKEN,
//     products: PLAID_PRODUCTS,
//   });
// });

export { router };
