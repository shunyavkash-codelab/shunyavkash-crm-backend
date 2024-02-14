var express = require("express");
var router = express.Router();
const { authenticateToken, auth } = require("../middleware/verifyToken");
const Schema = require("../validationSchema/leaveSchema");
const { errorHandal } = require("../middleware/comman");
const {
  getUserPermission,
  editPermission,
} = require("../controller/v1/permission");

// get permission by userId
router.get("/user/:id", authenticateToken, auth(0, 1, 2), getUserPermission);

// edit permission
router.patch("/:id", authenticateToken, auth(0), editPermission);

module.exports = router;
