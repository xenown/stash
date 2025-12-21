/**
 * @fileoverview Entry point for setting up the server and its dependencies.
 */

// // APIS
// // Healthcheck
// // User Creation
// // Account Registration
// // Pull accounts
// // Pull transactions / account
// // Extension
// //

import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import { transports, format } from "winston";
import { logger } from "express-winston";

import { router as accountRouter } from "./endpoints/AccountEndpoints";
import { router as txnRouter } from "./endpoints/TransactionEndpoints";

// Read in .env config values
dotenv.config();

// Set up Plaid client

// Set up Sqlite Database

// Set up backend server
const app = express();
const port = 3000;

app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());
// https://expressjs.com/en/advanced/best-practice-performance.html
// Use gzip compression for responses for smaller response payloads
app.use(compression());
app.use(cors());

// express-winston logger makes sense BEFORE the router
app.use(
  logger({
    transports: [new transports.Console()],
    format: format.combine(format.colorize(), format.json()),
  }),
);

// Register Core Endpoints
app.get("/health", (_, res) => {
  // Check Sqlite file state
  // Check Plaid client state
  res.send("Hello from TypeScript Express!");
});

app.use("/api", accountRouter);
app.use("/api", txnRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
