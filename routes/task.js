var express = require("express");
var router = express.Router();
const { add, gettaskByProject } = require("../controller/v1/task");
const Schema = require("../validationSchema/taskSchema");
const errorHandal = require("../middleware/comman").errorHandal;
const { getRecord } = require("../middleware/getRecord");
const Task = require("../model/task");
const { authenticateToken, auth } = require("../middleware/verifyToken");
var Model = Task;

// create new task
router.post("/add", Schema.addSchema, authenticateToken, auth(0, 1), add);

// get task by projectId
router.get("/tasks/:id", gettaskByProject);

// multiple get project
// router.get("/get-projects", authenticateToken, getProjects);

// single get project
// router.get(
//   "/:id",
//   authenticateToken,
//   Schema.getProjectByIdSchema,
//   errorHandal,
//   getRecord(Model),
//   getProjectById
// );

module.exports = router;
