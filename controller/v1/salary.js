const { default: mongoose } = require("mongoose");
const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Pagination = require("../../middleware/pagination");
const Salary = require("../../model/salary");
const { validationResult } = require("express-validator");
var Model = Salary;

// create salary
exports.add = asyncHandler(async (req, res, next) => {
  try {
    console.log(req.user._id);
    req.body.userId = req.user._id;
    const salary = await Model.create(req.body);
    return Comman.setResponse(
      res,
      201,
      true,
      "Salary added successfully",
      salary
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

// Get salary
exports.getSalaryList = asyncHandler(async (req, res, next) => {
  try {
    const aggregate = [
      {
        $match: {
          employee: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "employee",
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
        $addFields: {
          employee: {
            $first: "$employee.name",
          },
        },
      },
    ];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Salary get successfully.",
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
