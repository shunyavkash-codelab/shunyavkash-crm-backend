const { check, param } = require("express-validator");

const Schema = {};

Schema.applyLeaveSchema = [
  check("leaveType").notEmpty().withMessage("leaveType is a required field"),
  check("startDayType")
    .notEmpty()
    .withMessage("starDayType is a required field"),
  check("endDayType").notEmpty().withMessage("endDayType is a required field"),
  check("reason").notEmpty().withMessage("reason is a required field"),
  check("startDate").notEmpty().withMessage("startDate is a required field"),
  check("endDate").notEmpty().withMessage("endDate is a required field"),
];

Schema.editLeaveSchema = [
  check("status").notEmpty().withMessage("status is a required field"),
  check("description")
    .notEmpty()
    .withMessage("description is a required field"),
];

Schema.getLeaveSchema = [
  check("id").notEmpty().withMessage("id is a required field"),
];
module.exports = Schema;
