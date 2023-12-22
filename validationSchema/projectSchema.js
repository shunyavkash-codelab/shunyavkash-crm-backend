const { check, param } = require("express-validator");

const Schema = {};

Schema.addSchema = [
  check("name").notEmpty().withMessage("name is a required field"),
  check("clientId").notEmpty().withMessage("clientId is a required field"),
  check("perHourCharge")
    .notEmpty()
    .withMessage("perHourCharge include country code"),
  check("currency").notEmpty().withMessage("currency is a required field"),
  check("prefix").notEmpty().withMessage("prefix is a required field"),
];

Schema.getProjectByIdSchema = [
  param("id").notEmpty().withMessage("id is a required field"),
];
module.exports = Schema;
