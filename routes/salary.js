var express = require("express");
var router = express.Router();
const { add, edit, gettaskByProject } = require("../controller/v1/salary");
const Schema = require("../validationSchema/salarySchema");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const Salary = require("../model/salary");
const { authenticateToken, auth } = require("../middleware/verifyToken");

// create new salary
router.post("/add", Schema.addSchema, authenticateToken, auth(0), add);

module.exports = router;
