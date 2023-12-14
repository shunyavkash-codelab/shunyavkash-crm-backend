var express = require("express");
var router = express.Router();
const {
  add,
  login,
  getManagerById,
  getManagers,
  editManager,
  forgetPassword,
  resetPassword,
  changePassword,
} = require("../controller/v1/manager");
const Schema = require("../validationSchema/managerSchema");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const Manager = require("../model/manager");
const { authenticateToken, auth } = require("../middleware/verifyToken");
var Model = Manager;

// add manager by admin
router.post("/add", Schema.signupSchema, add);

// login
router.post("/login", Schema.loginSchema, login);

// forget password
router.post("/forget-password", Schema.forgetPassword, forgetPassword);

// reset password (forgot password)
router.post("/reset-password", Schema.resetPassword, resetPassword);

// change password (profile)
router.post(
  "/change-password",
  authenticateToken,
  Schema.resetPassword,
  changePassword
);

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
  auth(0, 1),
  errorHandal,
  getRecord(Model),
  editManager
);

module.exports = router;
