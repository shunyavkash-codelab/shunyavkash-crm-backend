var express = require("express");
var router = express.Router();
const { add, getAccountList } = require("../controller/v1/accountManagement");
const errorHandal = require("../middleware/comman").errorHandal;
const Schema = require("../validationSchema/accountManagementSchema");
const { getRecord } = require("../middleware/getRecord");
const accountManagement = require("../model/accountManagement");
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

// get all account management
router.get("/", getAccountList);

module.exports = router;
