const { check, param } = require("express-validator");

const Schema = {};

Schema.addSchema = [
  check("holderName").notEmpty().withMessage("holderName is a required field"),
  check("bankName").notEmpty().withMessage("bankName is a required field"),
  check("IFSC").notEmpty().withMessage("IFSC is a required field"),
  check("accountNumber")
    .notEmpty()
    .withMessage("accountNumber is a required field"),
];

Schema.getBankByIdSchema = [
  param("id").notEmpty().withMessage("id is a required field"),
];

module.exports = Schema;
