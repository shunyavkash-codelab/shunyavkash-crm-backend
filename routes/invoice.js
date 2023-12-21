var express = require("express");
var router = express.Router();
const { generateInvoiceNum } = require("../controller/v1/invoice");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const Invoice = require("../model/invoice");
const { authenticateToken, auth } = require("../middleware/verifyToken");
var Model = Invoice;

// create new bank
router.get(
  "/generate-invoice-number",
  authenticateToken,
  auth(0, 1),
  generateInvoiceNum
);

module.exports = router;
