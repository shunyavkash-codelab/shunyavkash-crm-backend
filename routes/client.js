var express = require("express");
var router = express.Router();
const {
  add,
  getClients,
  getClientById,
  editClient,
  deleteClient,
} = require("../controller/v1/client");
const Schema = require("../validationSchema/clientSchema");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const Client = require("../model/client");
const { authenticateToken, auth } = require("../middleware/verifyToken");
var Model = Client;

router.post(
  "/add",
  authenticateToken,
  auth(0),
  Schema.addSchema,
  errorHandal,
  add
);

// multiple get client
router.get("/get-clients", authenticateToken, auth(0, 1), getClients);

// single get client
router.get(
  "/:id",
  authenticateToken,
  auth(0, 1),
  Schema.getClientByIdSchema,
  errorHandal,
  getRecord(Model),
  getClientById
);

// edit client
router.patch(
  "/:id",
  authenticateToken,
  auth(0),
  Schema.getClientByIdSchema,
  errorHandal,
  getRecord(Model),
  editClient
);

// delete client
router.delete(
  "/:id",
  authenticateToken,
  auth(0),
  Schema.getClientByIdSchema,
  errorHandal,
  getRecord(Model),
  deleteClient
);

module.exports = router;
