const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Permission = require("../../model/permission");
var Model = Permission;

// get userId wise permission
exports.getUserPermission = asyncHandler(async (req, res) => {
  try {
    let userId = req.params.id;
    const permission = await Model.findOne({ userId: userId });
    if (!permission) {
      return Comman.setResponse(res, 200, true, "Record not found.");
    }
    return Comman.setResponse(
      res,
      200,
      true,
      "Get user permission successfully.",
      permission
    );
  } catch (error) {
    Comman.setResponse(res, 400, false, "Something went wrong.");
  }
});

// edit permission
exports.editPermission = asyncHandler(async (req, res) => {
  try {
    let permission = await Model.findById(req.params.id);
    if (!permission) {
      return Comman.setResponse(res, 200, true, "Record not found.");
    }
    changePermission = await Model.findByIdAndUpdate(permission._id, req.body, {
      new: true,
    });
    return Comman.setResponse(
      res,
      200,
      true,
      "Edit permission successfully.",
      changePermission
    );
  } catch (error) {
    Comman.setResponse(res, 400, false, "Something went wrong.");
  }
});
