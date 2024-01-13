var express = require("express");
var router = express.Router();
const { authenticateToken, auth } = require("../middleware/verifyToken");
const {
  applyLeave,
  edit,
  all,
  getLeaveByUserId,
} = require("../controller/v1/leave");
const Schema = require("../validationSchema/leaveSchema");
const { errorHandal } = require("../middleware/comman");
const { getRecord } = require("../middleware/getRecord");
const Leave = require("../model/leave");
var Model = Leave;

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
router.get("/all", authenticateToken, auth(0), all);

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
  auth(0),
  errorHandal,
  getRecord(Model),
  edit
);

module.exports = router;
