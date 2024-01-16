const { default: mongoose } = require("mongoose");
const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Pagination = require("../../middleware/pagination");
const accountManagement = require("../../model/accountManagement");
const { validationResult } = require("express-validator");
var Model = accountManagement;

// add account
exports.add = asyncHandler(async (req, res, next) => {
  try {
    req.body.userId = req.user._id;
    const addAccount = await Model.create(req.body);

    return Comman.setResponse(
      res,
      201,
      true,
      `${req.body.type} added successfully`,
      addAccount
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

// Get Account management
exports.getAccountList = asyncHandler(async (req, res, next) => {
  try {
    let aggregate = [];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get account management successfully.",
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
