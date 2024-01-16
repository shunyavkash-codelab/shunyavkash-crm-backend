const { check, param } = require("express-validator");

const Schema = {};

Schema.addSchema = [
  check("type").notEmpty().withMessage("type is a required field"),
  check("date").notEmpty().withMessage("date is a required field"),
  check("title").notEmpty().withMessage("title is a required field"),
  check("description")
    .notEmpty()
    .withMessage("description is a required field"),
  check("amount").notEmpty().withMessage("amount is a required field"),
  check("invoiceType")
    .notEmpty()
    .withMessage("invoiceType is a required field"),
  check("invoiceOwner")
    .notEmpty()
    .withMessage("invoiceOwner is a required field"),
  check("paymentMethod")
    .notEmpty()
    .withMessage("paymentMethod is a required field"),
  check("collaboration")
    .notEmpty()
    .withMessage("collaboration is a required field"),
];

module.exports = Schema;
