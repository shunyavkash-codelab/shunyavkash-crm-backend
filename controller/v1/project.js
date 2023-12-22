const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const bcrypt = require("bcrypt");
const Pagination = require("../../middleware/pagination");
const Project = require("../../model/project");
const { default: mongoose } = require("mongoose");
const { validationResult } = require("express-validator");
var Model = Project;

// create new project
exports.add = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Comman.setResponse(res, 400, false, "Required params not found.", {
      errors: errors.array(),
    });
  }
  try {
    const checkPrefix = await Model.findOne({ prefix: req.body.prefix });
    if (checkPrefix) {
      return Comman.setResponse(res, 409, false, "This prefix already exists.");
    }
    req.body.managerId = req.user.id;
    const project = await Model.create(req.body);
    return Comman.setResponse(
      res,
      201,
      true,
      "Project added successfully.",
      project
    );
  } catch (error) {
    console.log(error);
    return Comman.setResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
});

// get single project
exports.getProjectById = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Comman.setResponse(res, 400, false, "Required params not found.", {
      errors: errors.array(),
    });
  }
  try {
    let project = await Model.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "managers",
          localField: "managerId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "managerName",
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "clientName",
        },
      },
      {
        $addFields: {
          clientName: {
            $first: "$clientName.name",
          },
          managerName: {
            $first: "$managerName.name",
          },
        },
      },
    ]);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get client successfully.",
      project[0]
    );
  } catch (error) {
    console.log(error);
    return Comman.setResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
});

// get multiple project
exports.getProjects = asyncHandler(async (req, res, next) => {
  try {
    const aggregate = [
      {
        $lookup: {
          from: "managers",
          localField: "managerId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "managerName",
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "clientName",
        },
      },
      {
        $addFields: {
          clientName: {
            $first: "$clientName.name",
          },
          managerName: {
            $first: "$managerName.name",
          },
        },
      },
    ];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get managers successfully.",
      result
    );
  } catch (error) {
    console.log(error);
    return Comman.setResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
});

// get project by clientId
exports.getProjectsByClient = asyncHandler(async (req, res, next) => {
  try {
    let id = req.params.id;
    const project = await Model.find({ clientId: id });
    return Comman.setResponse(
      res,
      200,
      true,
      "Get client successfully.",
      project
    );
  } catch (error) {
    console.log(error);
    return Comman.setResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
});
