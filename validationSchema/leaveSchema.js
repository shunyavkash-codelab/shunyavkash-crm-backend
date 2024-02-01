const { check, param } = require("express-validator");

const Schema = {};

Schema.applyLeaveSchema = [
  check("leaveType").notEmpty().withMessage("leaveType is a required field"),
  check("startDayType")
    .notEmpty()
    .withMessage("starDayType is a required field"),
  check("endDayType").custom((value, { req }) => {
    if (req.body.moreDay === true && !value) {
      throw new Error("endDayType is a required field");
    }
    return true;
  }),
  check("reason").notEmpty().withMessage("reason is a required field"),
  check("startDate").notEmpty().withMessage("startDate is a required field"),
  check("endDate").custom((value, { req }) => {
    if (req.body.moreDay === true && !value) {
      throw new Error("endDayType is a required field");
    }
    return true;
  }),
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
