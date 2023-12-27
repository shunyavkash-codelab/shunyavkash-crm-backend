var express = require("express");
var router = express.Router();
const { getAdminByRole, editAdmin } = require("../controller/v1/admin");

// get admin by role
router.get("/getAdmin", getAdminByRole);

// edit admin
router.patch("/edit", editAdmin);

module.exports = router;
