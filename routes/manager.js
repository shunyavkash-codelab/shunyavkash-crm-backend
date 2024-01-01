var express = require("express");
var router = express.Router();
const {
  addEmployee,
  login,
  getManagerById,
  getManagers,
  getEmployees,
  editManager,
  forgetPassword,
  resetPassword,
  changePassword,
  getAllEmployees,
  deleteEmployee,
} = require("../controller/v1/manager");
const Schema = require("../validationSchema/managerSchema");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const Manager = require("../model/manager");
const { authenticateToken, auth } = require("../middleware/verifyToken");
var Model = Manager;

// add employee
router.post(
  "/add",
  Schema.addEmployeeSchema,
  authenticateToken,
  auth(0),
  addEmployee
);

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

// multiple get employee
router.get("/get-employee", authenticateToken, getEmployees);

// get All Employees
router.get("/get-all-employees", authenticateToken, auth(0), getAllEmployees);

// single get manager
router.get(
  "/:id",
  authenticateToken,
  Schema.getManagerByIdSchema,
  errorHandal,
  // getRecord(Model),
  getManagerById
);

// edit manager
router.patch(
  "/:id",
  authenticateToken,
  auth(0, 1, 2),
  errorHandal,
  getRecord(Model),
  editManager
);

// delete emaployee and manager
router.delete(
  "/:id",
  authenticateToken,
  auth(0),
  getRecord(Model),
  deleteEmployee
);

module.exports = router;
