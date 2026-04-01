/**
 * @fileoverview Endpoint Input Validators
 */

import type { ValidationChain } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import type { Error } from "./Utils.ts";
import { body, validationResult } from "express-validator";
import { CountryCode, Products } from "plaid";

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const validation of validations) {
      await validation.run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        break; // Stop running further validations if errors are found
      }
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const error: Error = {
      errors: errors.array(),
    };

    return res.status(400).json(error);
  };
};

const COUNTRY_CODE_VALUES = Object.values(CountryCode);
const PRODUCT_VALUES = Object.values(Products);

const stringArrayValidator = (fieldName: string) => {
  return body(fieldName)
    .exists()
    .withMessage(`${fieldName} is required`)
    .isArray({ min: 1 })
    .withMessage(`${fieldName} must be a non-empty array`)
    .bail();
};

const countryCodeValidator = body("countryCodes.*")
  .isString()
  .withMessage("all elements should be strings")
  .bail()
  .customSanitizer((countryCode: string) => {
    return countryCode.toUpperCase();
  })
  .isIn(COUNTRY_CODE_VALUES)
  .withMessage("countryCodes must be a valid plaid recognized country code");

const productValidator = body("products.*")
  .isString()
  .withMessage("all elements should be strings")
  .bail()
  .customSanitizer((product: string) => {
    return product.toLowerCase();
  })
  .isIn(PRODUCT_VALUES)
  .withMessage("products must be a valid plaid recognized product");

export {
  validate,
  stringArrayValidator,
  countryCodeValidator,
  productValidator,
};
