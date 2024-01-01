const { check, param } = require("express-validator");

const Schema = {};

Schema.addSchema = [
  check("invoiceNumber")
    .notEmpty()
    .withMessage("Invoice number is a required field")
    .isLength(11),
];

Schema.getInvoiceByIdSchema = [
  param("id").notEmpty().withMessage("id is a required field"),
];
module.exports = Schema;
