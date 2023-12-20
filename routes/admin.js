var express = require("express");
var router = express.Router();
const { getAdminByRole } = require("../controller/v1/admin");

// get admin by role
router.get("/getAdmin", getAdminByRole);

module.exports = router;
