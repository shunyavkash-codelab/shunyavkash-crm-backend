const { default: mongoose } = require("mongoose");
const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Pagination = require("../../middleware/pagination");
const Leave = require("../../model/leave");
const moment = require("moment");
var Model = Leave;

const fieldNames = ["status", "description"];

exports.applyLeave = asyncHandler(async (req, res) => {
  try {
    req.body.userId = req.user._id;
    let already = await Model.findOne(req.body);
    if (already) {
      return Comman.setResponse(res, 409, false, "Your leave already applied.");
    }
    const applyLeave = await Model.create(req.body);
    Comman.setResponse(
      res,
      201,
      true,
      "Your leave apply successfully.",
      applyLeave
    );
  } catch (error) {
    return Comman.setResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
});

exports.edit = asyncHandler(async (req, res) => {
  try {
    fieldNames.forEach((field) => {
      if (req.body[field] != null) res.record[field] = req.body[field];
    });
    await Model.updateOne({ _id: req.params.id }, res.record, { new: true });
    return Comman.setResponse(
      res,
      200,
      true,
      `Leave ${req.body.status} successfully.`
    );
  } catch (error) {
    return Comman.setResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
});

exports.all = asyncHandler(async (req, res) => {
  try {
    let search = {};
    if (req.query.search) {
      search.userName = { $regex: req.query.search, $options: "i" };
    }
    let filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const aggregate = [
      { $match: filter },
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
        $addFields: {
          userName: {
            $first: "$userName.name",
          },
        },
      },
      {
        $match: search,
      },
    ];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get all leave application successfully.",
      result
    );
  } catch (error) {
    return Comman.setResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
});

// only approve leave request
exports.approveLeaves = asyncHandler(async (req, res) => {
  try {
    let search = {};
    if (req.query.search) {
      search.userName = { $regex: req.query.search, $options: "i" };
    }
    let today = moment().format("YYYY-MM-DD");
    const aggregate = [
      {
        $match: {
          status: "approve",
          startDate: {
            $gte: new Date(today + "T00:00:00.000Z"),
            $lte: new Date(today + "T23:59:59.999Z"),
          },
          endDate: {
            $gte: new Date(today + "T00:00:00.000Z"),
            $lte: new Date(today + "T23:59:59.999Z"),
          },
        },
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
        $addFields: {
          userName: {
            $first: "$userName.name",
          },
        },
      },
      {
        $match: search,
      },
    ];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get all leave application successfully.",
      result
    );
  } catch (error) {
    return Comman.setResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
});

// get userId wise leave
exports.getLeaveByUserId = asyncHandler(async (req, res) => {
  let userId = req.params.id;
  const leave = await Model.find({ userId: userId }).sort({ createdAt: -1 });
  return Comman.setResponse(
    res,
    200,
    true,
    "Get leave application successfully.",
    leave
  );
});

// get leave dashboard
exports.leaveDashboard = asyncHandler(async (req, res) => {
  let obj = {};
  if (req.query.userId) {
    obj.userId = new mongoose.Types.ObjectId(req.query.userId);
    obj.status = "approve";
  }
  const leaveData = await Model.aggregate([
    { $match: obj },
    {
      $group: {
        _id: null,
        sick: {
          $sum: {
            $cond: [{ $eq: ["$leaveType", "sick"] }, 1, 0],
          },
        },
        casual: {
          $sum: {
            $cond: [{ $eq: ["$leaveType", "casual"] }, 1, 0],
          },
        },
        paid: {
          $sum: {
            $cond: [{ $eq: ["$leaveType", "paid"] }, 1, 0],
          },
        },
        unpaid: {
          $sum: {
            $cond: [{ $eq: ["$leaveType", "unpaid"] }, 1, 0],
          },
        },
        total: { $sum: 1 },
      },
    },
  ]);
  return Comman.setResponse(
    res,
    200,
    true,
    "Get leave data successfully.",
    leaveData[0]
  );
});
