const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Pagination = require("../../middleware/pagination");
const Task = require("../../model/task");
const { default: mongoose } = require("mongoose");
const { validationResult } = require("express-validator");
var Model = Task;

// create task
exports.add = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Comman.setResponse(res, 400, false, "Required params not found.", {
      errors: errors.array(),
    });
  }
  try {
    console.log("innn nnnn");
    req.body.managerId = req.user.id;
    const task = await Model.create(req.body);
    return Comman.setResponse(res, 201, true, "Task added successfully.", task);
  } catch (error) {
    console.log(error);
    if (error.code == 11000) {
      return Comman.setResponse(res, 400, false, "Already use task number.");
    }
    return Comman.setResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
});

// get multiple task by projectId
exports.gettaskByProject = asyncHandler(async (req, res, next) => {
  try {
    let id = req.params.id;
    const task = await Model.find({ projectId: id });
    return Comman.setResponse(res, 200, true, "Get task successfully.", task);
  } catch (error) {
    return Comman.setResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
});
