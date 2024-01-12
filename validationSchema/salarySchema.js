const { check, param } = require("express-validator");

const Schema = {};

Schema.addSchema = [
  check("userId").notEmpty().withMessage("UserId is required fied"),
  check("name")
    .notEmpty()
    .withMessage("Name is a required field")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("Name must contain only alphabet characters"),
  check("amount")
    .notEmpty()
    .withMessage("Amount is a required field")
    .isNumeric()
    .withMessage("Amount must contain only numeric values"),
  check("status").notEmpty().withMessage("Status is required fied"),
];

module.exports = Schema;
