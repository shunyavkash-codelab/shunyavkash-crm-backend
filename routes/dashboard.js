var express = require("express");
var router = express.Router();
const { dashboard } = require("../controller/v1/dashboard");
// const Schema = require("../validationSchema/projectSchema");
const errorHandal = require("../middleware/comman").errorHandal;
// const { getRecord } = require("../middleware/getRecord");
const Project = require("../model/project");
const { authenticateToken } = require("../middleware/verifyToken");
var Model = Project;

// get dashbord data like (total manager, total clients, total project, total invoice)
router.get("/dashboard", dashboard);

module.exports = router;
