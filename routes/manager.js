var express = require("express");
var router = express.Router();
const {
  signup,
  login,
  getManagerById,
  getManagers,
  editManager,
} = require("../controller/v1/manager");
const Schema = require("../validationSchema/managerSchema");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const Manager = require("../model/manager");
const { authenticateToken } = require("../middleware/verifyToken");
var Model = Manager;

// registration
router.post("/signup", Schema.signupSchema, signup);

// login
router.post("/login", Schema.loginSchema, login);

// multiple get manager
router.get("/get-managers", authenticateToken, getManagers);

// single get manager
router.get(
  "/:id",
  authenticateToken,
  Schema.getManagerByIdSchema,
  errorHandal,
  getRecord(Model),
  getManagerById
);

// edit manager
router.patch(
  "/:id",
  authenticateToken,
  errorHandal,
  getRecord(Model),
  editManager
);

module.exports = router;
