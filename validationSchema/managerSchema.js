const { check, param } = require("express-validator");

const Schema = {};

Schema.addEmployeeSchema = [
  check("name").notEmpty().withMessage("Name is a required field"),
  check("email")
    .notEmpty()
    .withMessage("email is a required field")
    .isLength({ min: 3, max: 84 })
    .isEmail()
    .withMessage("email address not valid"),
  check("password").notEmpty().withMessage("Password is a required field"),
  check("role").notEmpty().withMessage("Role is a required field"),
];

Schema.loginSchema = [
  check("email")
    .notEmpty()
    .withMessage("email is a required field")
    .isLength({ min: 3, max: 84 })
    .isEmail()
    .withMessage("email address not valid"),
  check("password").notEmpty().withMessage("password is a required field"),
];

Schema.getManagerByIdSchema = [
  param("id").notEmpty().withMessage("id is a required field"),
];

Schema.forgetPassword = [
  check("email")
    .notEmpty()
    .withMessage("email is a required field")
    .isLength({ min: 3, max: 84 })
    .isEmail()
    .withMessage("email address not valid"),
];

Schema.resetPassword = [
  check("password").notEmpty().withMessage("password is a required field"),
];
module.exports = Schema;
