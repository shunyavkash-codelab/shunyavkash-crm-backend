var express = require("express");
var router = express.Router();
const { add, getSalaryList, deleteSalary } = require("../controller/v1/salary");
const Schema = require("../validationSchema/salarySchema");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const Salary = require("../model/salary");
const { authenticateToken, auth } = require("../middleware/verifyToken");

// create new salary
router.post(
  "/add",
  Schema.addSchema,
  errorHandal,
  authenticateToken,
  auth(0),
  add
);

// get salary by userId
router.get("/user/:id", authenticateToken, getSalaryList);

// get all salary
router.get("/", authenticateToken, auth(0), getSalaryList);

// create new salary
router.delete(
  "/:id",
  authenticateToken,
  auth(0),
  Schema.getSalaryByIdSchema,
  errorHandal,
  deleteSalary
);

module.exports = router;
