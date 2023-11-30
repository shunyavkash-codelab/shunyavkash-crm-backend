var express = require("express");
var router = express.Router();
const {
  add,
  getProjects,
  getProjectById,
} = require("../controller/v1/project");
const Schema = require("../validationSchema/projectSchema");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const Project = require("../model/project");
const { authenticateToken } = require("../middleware/verifyToken");
var Model = Project;

// create new project
router.post("/add", Schema.addSchema, authenticateToken, add);

// multiple get project
router.get("/getProjects", authenticateToken, getProjects);

// single get project
router.get(
  "/:id",
  authenticateToken,
  Schema.getProjectByIdSchema,
  errorHandal,
  getRecord(Model),
  getProjectById
);

module.exports = router;
