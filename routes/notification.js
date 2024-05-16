var express = require("express");
var router = express.Router();
const { authenticateToken, auth } = require("../middleware/verifyToken");
const { get, getCount } = require("../controller/v1/notification");

router.get("/", authenticateToken, get);

router.get("/unread-count", authenticateToken, getCount);

module.exports = router;
