var express = require("express");
var router = express.Router();
const { add, getSalaryList } = require("../controller/v1/salary");
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

// get salary
router.get("/user/:id", authenticateToken, getSalaryList);

router.get("/", authenticateToken, auth(0), getSalaryList);

module.exports = router;
