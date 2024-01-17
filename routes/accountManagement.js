var express = require("express");
var router = express.Router();
const {
  add,
  getAccountList,
  accountDashboard,
  viewTransaction,
  editTransaction,
} = require("../controller/v1/accountManagement");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const accountManagement = require("../model/accountManagement");
const { authenticateToken, auth } = require("../middleware/verifyToken");
const Schema = require("../validationSchema/accountManagementSchema");
let Model = accountManagement;

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
router.get("/", authenticateToken, auth(0), getAccountList);

router.get("/dashboard", authenticateToken, auth(0), accountDashboard);

// view transaction
router.get("/viewTransaction/:id", authenticateToken, auth(0), viewTransaction);

// edit transaction
router.patch(
  "/editTransaction/:id",
  authenticateToken,
  auth(0),
  getRecord(Model),
  editTransaction
);

module.exports = router;
