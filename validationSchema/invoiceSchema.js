const { check, param } = require("express-validator");

const Schema = {};

Schema.addSchema = [
  check("invoiceNumber")
    .notEmpty()
    .withMessage("Invoice number is a required field")
    .isLength(11)
    .withMessage("The invoice number should consist of 11 digits."),
];

Schema.getInvoiceByIdSchema = [
  param("id").notEmpty().withMessage("id is a required field"),
];

Schema.deleteInvoiceByIdSchema = [
  check("ids").notEmpty().withMessage("ids is a required field"),
];
module.exports = Schema;
