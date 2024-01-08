var express = require("express");
var router = express.Router();
const {
  addEmployee,
  login,
  getUserById,
  getUsers,
  getEmployees,
  editUser,
  forgetPassword,
  resetPassword,
  changePassword,
  getAllEmployees,
  deleteEmployee,
} = require("../controller/v1/user");
const Schema = require("../validationSchema/userSchema");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const User = require("../model/user");
const { authenticateToken, auth } = require("../middleware/verifyToken");
var Model = User;

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

// multiple get user
router.get("/get-users", authenticateToken, getUsers);

// multiple get employee
router.get("/get-employee", authenticateToken, getEmployees);

// get All Employees
router.get("/get-all-employees", authenticateToken, auth(0), getAllEmployees);

// single get user
router.get(
  "/:id",
  authenticateToken,
  // Schema.getUserByIdSchema,
  errorHandal,
  // getRecord(Model),
  getUserById
);

// edit user
router.patch(
  "/:id",
  authenticateToken,
  auth(0, 1, 2),
  errorHandal,
  getRecord(Model),
  editUser
);

// delete emaployee and user
router.delete(
  "/:id",
  authenticateToken,
  auth(0),
  getRecord(Model),
  deleteEmployee
);

module.exports = router;
