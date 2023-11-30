const { check, param } = require("express-validator");

const Schema = {};

Schema.addSchema = [
  check("email")
    .notEmpty()
    .withMessage("email is a required field")
    .isLength({ min: 3, max: 84 })
    .isEmail()
    .withMessage("email address not valid"),
  check("mobileNumber").notEmpty().withMessage("mobile is a required field"),
  check("mobileCode").notEmpty().withMessage("please include country code"),
];

Schema.getClientByIdSchema = [
  param("id").notEmpty().withMessage("id is a required field"),
];
module.exports = Schema;
