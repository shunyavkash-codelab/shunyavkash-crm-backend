const { default: mongoose } = require("mongoose");
const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Pagination = require("../../middleware/pagination");
const Leave = require("../../model/leave");
const moment = require("moment");
const User = require("../../model/user");
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
    const admin = await User.findOne({ role: 0 }).select("_id");
    const notiObj = {
      sender: req.user._id,
      receiver: admin._id,
      text: ` apply for "${applyLeave.leaveType} leave".`,
      itemId: applyLeave._id,
      type: "leaves-requests",
    };
    await Comman.createNotification(notiObj);
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
    let leaveUser = await User.findById(res.record.userId);
    if (leaveUser.role === 1 && req.user.role === 1) {
      return Comman.setResponse(
        res,
        403,
        false,
        `You are not authorized to this route.`
      );
    }
    fieldNames.forEach((field) => {
      if (req.body[field] != null) res.record[field] = req.body[field];
    });
    await Model.updateOne({ _id: req.params.id }, res.record, { new: true });
    const notiObj = {
      sender: req.user._id,
      receiver: leaveUser._id,
      text: `${req.body.status} your "${applyLeave.leaveType}" leave.`,
      itemId: req.params.id,
      type: "my-leave",
    };
    await Comman.createNotification(notiObj);
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
                role: 1,
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
          userRole: {
            $first: "$userName.role",
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
    const aggregate = [
      {
        $match: {
          status: "approve",
          $or: [
            {
              startDate: {
                $gte: new Date(
                  moment(req.query.date).startOf("day").toISOString()
                ),
                $lte: new Date(
                  moment(req.query.date).endOf("day").toISOString()
                ),
              },
            },
            {
              endDate: {
                $gte: new Date(
                  moment(req.query.date).startOf("day").toISOString()
                ),
                $lte: new Date(
                  moment(req.query.date).endOf("day").toISOString()
                ),
              },
            },
          ],
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

// delete leave
exports.deleteLeave = asyncHandler(async (req, res, next) => {
  try {
    await Model.findByIdAndDelete(req.params.id);
    return Comman.setResponse(res, 200, true, "Leave delete successfully.");
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
