var express = require("express");
var router = express.Router();
const { authenticateToken, auth } = require("../middleware/verifyToken");
const {
  applyLeave,
  edit,
  all,
  getLeaveByUserId,
  leaveDashboard,
  approveLeaves,
  deleteLeave,
} = require("../controller/v1/leave");
const Schema = require("../validationSchema/leaveSchema");
const { errorHandal } = require("../middleware/comman");
const { getRecord } = require("../middleware/getRecord");
const Leave = require("../model/leave");
var Model = Leave;

// get all leaves
router.get("/dashboard", authenticateToken, auth(0, 1, 2), leaveDashboard);

// apply leave
router.post(
  "/apply",
  Schema.applyLeaveSchema,
  authenticateToken,
  auth(0, 1, 2),
  errorHandal,
  applyLeave
);

// get all leaves
router.get("/all", authenticateToken, auth(0, 1, 2), all);

// get all approve leaves
router.get("/approve", authenticateToken, auth(0, 1, 2), approveLeaves);

// get singal user leave by userId
router.get(
  "/user/:id",
  Schema.getLeaveSchema,
  authenticateToken,
  auth(0, 1, 2),
  getLeaveByUserId
);

// edit leave
router.patch(
  "/:id",
  Schema.editLeaveSchema,
  authenticateToken,
  auth(0, 1, 2),
  errorHandal,
  getRecord(Model),
  edit
);

// delete leave
router.delete(
  "/:id",
  authenticateToken,
  auth(0),
  Schema.getLeaveSchema,
  errorHandal,
  getRecord(Model),
  deleteLeave
);

module.exports = router;
