var express = require("express");
var router = express.Router();
const { add, getBanks, getBankById } = require("../controller/v1/bank");
const Schema = require("../validationSchema/bankSchema");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const Bank = require("../model/bank");
const { authenticateToken } = require("../middleware/verifyToken");
var Model = Bank;

// create new bank
router.post("/add", Schema.addSchema, authenticateToken, add);

// multiple get bank
router.get("/get-banks", authenticateToken, getBanks);

// single get bank
router.get(
  "/:id",
  authenticateToken,
  Schema.getBankByIdSchema,
  errorHandal,
  getRecord(Model),
  getBankById
);

module.exports = router;
