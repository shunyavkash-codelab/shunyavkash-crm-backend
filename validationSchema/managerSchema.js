const { check, param } = require("express-validator");

const Schema = {};

Schema.signupSchema = [
  check("email")
    .notEmpty()
    .withMessage("email is a required field")
    .isLength({ min: 3, max: 84 })
    .isEmail()
    .withMessage("email address not valid"),
  check("mobileNumber").notEmpty().withMessage("mobile is a required field"),
  check("mobileCode").notEmpty().withMessage("please include country code"),
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

Schema.changePassword = [
  check("password").notEmpty().withMessage("password is a required field"),
];
module.exports = Schema;
