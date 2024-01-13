const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Pagination = require("../../middleware/pagination");
const Leave = require("../../model/leave");
var Model = Leave;

const fieldNames = ["status", "description"];

exports.applyLeave = asyncHandler(async (req, res) => {
  try {
    console.log("object");
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
    const aggregate = [
      {
        $match: { status: "approve" },
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
  const leave = await Model.find({ userId: userId });
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
  const leaveData = await Model.aggregate([
    {
      $group: {
        _id: "$leaveType",
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  return Comman.setResponse(
    res,
    200,
    true,
    "Get leave data successfully.",
    leaveData
  );
});
