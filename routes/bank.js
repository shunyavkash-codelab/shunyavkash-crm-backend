var express = require("express");
var router = express.Router();
const {
  add,
  getBanks,
  getBankById,
  removeBankById,
} = require("../controller/v1/bank");
const Schema = require("../validationSchema/bankSchema");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const Bank = require("../model/bank");
const { authenticateToken, auth } = require("../middleware/verifyToken");
var Model = Bank;

// create new bank
router.post("/add", Schema.addSchema, authenticateToken, auth(1, 2), add);

// multiple get bank
router.get("/get-banks", authenticateToken, auth(1, 2), getBanks);

// single get bank
router.get(
  "/:id",
  authenticateToken,
  auth(1, 2),
  Schema.getBankByIdSchema,
  errorHandal,
  getRecord(Model),
  getBankById
);

// remove bank detile
router.delete(
  "/:id",
  authenticateToken,
  auth(1, 2),
  getRecord(Model),
  removeBankById
);

module.exports = router;
