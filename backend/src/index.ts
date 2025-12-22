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
import { createLogger, format, transports } from "winston";
import { logger as expressLogger } from "express-winston";

import { router as accountRouter } from "./endpoints/AccountEndpoints.ts";
import { router as txnRouter } from "./endpoints/TransactionEndpoints.ts";

// Read in .env config values
dotenv.config();

// Set up Plaid client

// Set up Sqlite Database

// Set up backend server
const app = express();
const port = 3000;

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: { service: "main" },
  transports: [new transports.Console()],
});

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
  expressLogger({
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

app.use("/account", accountRouter);
app.use("/api", txnRouter);

app.use((err, req, res, next) => {
  logger.error("Internal Exception", err);
  res
    .status(500)
    .send("An internal exception occured. Please try again later.");
});

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});

// Used for supertest testing
export { app };
