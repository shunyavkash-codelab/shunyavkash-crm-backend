const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Salary = require("../../model/salary");
const { default: mongoose } = require("mongoose");
const { validationResult } = require("express-validator");
var Model = Salary;

// create salary
exports.add = asyncHandler(async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Comman.setResponse(res, 400, false, "Required params not found.", {
        errors: errors.array(),
      });
    }
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
