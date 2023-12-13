const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const bcrypt = require("bcrypt");
const Pagination = require("../../middleware/pagination");
const Bank = require("../../model/bank");
const { encrypt, decrypt } = require("../../utils/encryption");
const { default: mongoose } = require("mongoose");
var Model = Bank;

// create new bank
exports.add = asyncHandler(async (req, res, next) => {
  try {
    const already = await Model.find({ managerId: req.user.id }).select(
      "accountNumber defaultBank"
    );
    for (let i = 0; i < already.length; i++) {
      if (decrypt(already[i].accountNumber) == req.body.accountNumber) {
        return Comman.setResponse(
          res,
          400,
          false,
          "This bank account is already exist."
        );
      }
      if (req.body.defaultBank == true) {
        already[i].defaultBank = false;
        await already[i].save();
      }
    }

    req.body.label = "******" + req.body.accountNumber.substring(6);
    req.body.accountNumber = encrypt(req.body.accountNumber);
    req.body.managerId = req.user.id;

    const bank = await Model.create(req.body);
    return Comman.setResponse(
      res,
      201,
      true,
      "This bank account added successfully.",
      bank
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

// get single bank
exports.getBankById = asyncHandler(async (req, res, next) => {
  try {
    return Comman.setResponse(
      res,
      200,
      true,
      "Get bank successfully.",
      res.record
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

// get multiple bank
exports.getBanks = asyncHandler(async (req, res, next) => {
  try {
    const aggregate = [
      {
        $match: {
          managerId: new mongoose.Types.ObjectId(req.user._id),
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

exports.removeBankById = asyncHandler(async (req, res, next) => {
  try {
    await Model.findOneAndDelete({ _id: res.record._id });
    return Comman.setResponse(res, 200, true, "Remove your bank details");
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
