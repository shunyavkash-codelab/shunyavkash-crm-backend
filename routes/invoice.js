var express = require("express");
var router = express.Router();
const {
  generateInvoiceNum,
  addInvoice,
  checkInvoiceNum,
  invoiceList,
  getInvoiceById,
  editInvoice,
  deleteInvoice,
} = require("../controller/v1/invoice");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const Invoice = require("../model/invoice");
const { authenticateToken, auth } = require("../middleware/verifyToken");
const Schema = require("../validationSchema/invoiceSchema");
var Model = Invoice;

// create new bank
router.get(
  "/generate-invoice-number",
  authenticateToken,
  auth(0, 1),
  generateInvoiceNum
);

// add invoice
router.post(
  "/add",
  Schema.addSchema,
  errorHandal,
  authenticateToken,
  auth(0),
  addInvoice
);

// add invoice
router.post(
  "/edit",
  Schema.addSchema,
  errorHandal,
  authenticateToken,
  auth(0),
  editInvoice
);

// check invoice number exist or not
router.get(
  "/check-invoice-number/:id",
  authenticateToken,
  auth(0),
  checkInvoiceNum
);

// check invoice number exist or not
router.get("/invoices", authenticateToken, auth(0), invoiceList);

// get single invoice
router.get(
  "/:id",
  authenticateToken,
  auth(0),
  Schema.getInvoiceByIdSchema,
  errorHandal,
  getRecord(Model),
  getInvoiceById
);

// delete invoice
router.delete(
  "/:id",
  authenticateToken,
  auth(0),
  Schema.getInvoiceByIdSchema,
  errorHandal,
  getRecord(Model),
  deleteInvoice
);

module.exports = router;
