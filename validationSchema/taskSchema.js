const { check, param } = require("express-validator");

const Schema = {};

Schema.addSchema = [
  check("projectId").notEmpty().withMessage("projectName is required fied"),
  check("taskNo").notEmpty().withMessage("taskNo is a required field"),
  check("taskName").notEmpty().withMessage("taskName is a required field"),
  check("hours").notEmpty().withMessage("hours is a required field"),
  check("taskPriority")
    .notEmpty()
    .withMessage("taskPriority is a required field"),
];

// Schema.getBankByIdSchema = [
//   param("id").notEmpty().withMessage("id is a required field"),
// ];

module.exports = Schema;
