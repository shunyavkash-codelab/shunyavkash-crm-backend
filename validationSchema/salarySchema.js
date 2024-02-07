const { check, param } = require("express-validator");

const Schema = {};

Schema.addSchema = [
  check("employee").notEmpty().withMessage("Employee name is a required field"),
  check("amount")
    .notEmpty()
    .withMessage("Amount is a required field")
    .isNumeric()
    .withMessage("Amount must contain only numeric values"),
  check("status").notEmpty().withMessage("Status is required field"),
  check("date").notEmpty().withMessage("Date is required field"),
];

Schema.getSalaryByIdSchema = [
  param("id").notEmpty().withMessage("id is a required field"),
];
module.exports = Schema;
