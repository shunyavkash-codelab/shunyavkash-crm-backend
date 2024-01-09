const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const bcrypt = require("bcrypt");
const Pagination = require("../../middleware/pagination");
const Project = require("../../model/project");
const { default: mongoose } = require("mongoose");
const { validationResult } = require("express-validator");
var Model = Project;

// use edit project field
const fieldNames = [
  "name",
  "payPeriod",
  "perHourCharge",
  "prefix",
  "startDate",
  "endDate",
  "status",
  "description",
  "currency",
  "clientId",
];

// create new project
exports.add = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Comman.setResponse(res, 400, false, "Required params not found.", {
      errors: errors.array(),
    });
  }
  try {
    req.body.userId = req.user.id;
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

// edit project
exports.edit = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Comman.setResponse(res, 400, false, "Required params not found.", {
      errors: errors.array(),
    });
  }
  try {
    const checkPrefix = await Model.findOne({
      _id: { $ne: req.params.id },
      prefix: req.body?.prefix,
    });
    if (checkPrefix) {
      return Comman.setResponse(res, 409, false, "This prefix already exists.");
    }
    fieldNames.forEach((field) => {
      if (req.body[field] != null) res.record[field] = req.body[field];
    });
    await Model.updateOne({ _id: req.params.id }, res.record, { new: true });
    return Comman.setResponse(res, 200, true, "Update project successfully.");
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
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "userName",
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
          userName: {
            $first: "$userName.name",
          },
        },
      },
    ]);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get project successfully.",
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
    let search = {};
    if (req.query.search) {
      search = { name: { $regex: req.query.search, $options: "i" } };
    }
    const aggregate = [
      { $match: search },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "userName",
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
          userName: {
            $first: "$userName.name",
          },
        },
      },
    ];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get projects successfully.",
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
    // const project = await Model.find({ clientId: id });
    const project = await Model.aggregate([
      {
        $match: {
          clientId: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "employeeId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "employee",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          clientId: 1,
          userId: 1,
          description: 1,
          startDate: 1,
          endDate: 1,
          perHourCharge: 1,
          currency: 1,
          payPeriod: 1,
          prefix: 1,
          status: 1,
          createdAt: 1,
          employeeName: "$employee.name",
        },
      },
    ]);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get projects successfully.",
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
