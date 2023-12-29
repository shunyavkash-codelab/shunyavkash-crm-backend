var express = require("express");
var router = express.Router();
const {
  generateInvoiceNum,
  addInvoice,
  checkInvoiceNum,
  invoiceList,
} = require("../controller/v1/invoice");
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

// add invoice
router.post("/add", authenticateToken, auth(0), addInvoice);

// check invoice number exist or not
router.get(
  "/check-invoice-number/:id",
  authenticateToken,
  auth(0),
  checkInvoiceNum
);

// check invoice number exist or not
router.get("/invoices", authenticateToken, auth(0), invoiceList);

module.exports = router;
