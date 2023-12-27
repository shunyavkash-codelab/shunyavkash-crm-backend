var express = require("express");
var router = express.Router();
const {
  add,
  edit,
  getProjects,
  getProjectById,
  getProjectsByClient,
} = require("../controller/v1/project");
const Schema = require("../validationSchema/projectSchema");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const Project = require("../model/project");
const { authenticateToken, auth } = require("../middleware/verifyToken");
var Model = Project;

// create new project
router.post("/add", Schema.addSchema, authenticateToken, auth(0, 1), add);

// edit project
router.patch(
  "/:id",
  Schema.addSchema,
  authenticateToken,
  auth(0, 1),
  getRecord(Model),
  edit
);

// multiple get project
router.get("/get-projects", authenticateToken, getProjects);

// single get project
router.get(
  "/:id",
  authenticateToken,
  Schema.getProjectByIdSchema,
  errorHandal,
  getRecord(Model),
  getProjectById
);

router.get("/get-project-name/:id", getProjectsByClient);

module.exports = router;
