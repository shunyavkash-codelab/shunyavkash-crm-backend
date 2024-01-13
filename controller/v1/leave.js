const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Pagination = require("../../middleware/pagination");
const Leave = require("../../model/leave");
var Model = Leave;

const fieldNames = ["status", "description"];

exports.applyLeave = asyncHandler(async (req, res) => {
  try {
    req.body.userId = req.user._id;
    let already = await Model.findOne(req.body);
    if (already) {
      return Comman.setResponse(res, 409, false, "Your leave already applied.");
    }
    await Model.create(req.body);
    Comman.setResponse(res, 201, true, "Your leave apply successfully.");
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
    const aggregate = [
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
