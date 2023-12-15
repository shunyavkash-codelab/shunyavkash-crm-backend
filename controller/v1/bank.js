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
    req.body.defaultBank = already.length == 0 ? true : req.body.defaultBank;

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

// delete bank
exports.removeBankById = asyncHandler(async (req, res, next) => {
  try {
    if (res.record.defaultBank)
      return Comman.setResponse(
        res,
        401,
        false,
        "Default bank can not remove."
      );
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

// change defult bank
exports.editDefaultBank = asyncHandler(async (req, res, next) => {
  let id = req.params.id;
  const defaultBank = await Model.findOne({
    managerId: req.user._id,
    defaultBank: true,
  });
  const bank = await Model.findById(id);
  if (!bank) return Comman.setResponse(res, 404, false, "Bank not found.");
  if (req.body.defaultBank) {
    if (defaultBank) {
      defaultBank.defaultBank = false;
      await defaultBank.save();
    }
    await Model.findByIdAndUpdate(
      id,
      { $set: { defaultBank: true } },
      { new: true }
    );
    return Comman.setResponse(res, 200, true, "Set default bank.");
  } else {
    return Comman.setResponse(
      res,
      400,
      false,
      "Please set other bank default."
    );
  }
});
