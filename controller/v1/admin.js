const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Manager = require("../../model/manager");

// use edit admin field
const fieldNames = [
  "email",
  "mobileCode",
  "mobileNumber",
  "address",
  "address2",
  "landmark",
  "pincode",
];

// get admin by role
exports.getAdminByRole = asyncHandler(async (req, res, next) => {
  try {
    // const admin = await Manager.findOne({ role: 0 }).select(
    //   "address address2 landmark pincode email mobileCode mobileNumber companyName"
    // );
    const admin = await Manager.aggregate([
      {
        $match: {
          role: 0,
        },
      },
      {
        $lookup: {
          from: "banks",
          localField: "_id",
          foreignField: "managerId",
          as: "bank",
        },
      },
    ]);
    if (!admin.length) {
      return Comman.setResponse(res, 404, false, "Admin does not exist.");
    }
    return Comman.setResponse(
      res,
      200,
      true,
      "Retrieve administrator details.",
      admin[0]
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

// admin update
exports.editAdmin = asyncHandler(async (req, res, next) => {
  try {
    const admin = await Manager.findOne({ role: 0 });
    if (!admin) {
      return Comman.setResponse(res, 404, false, "Admin does not exist.");
    }
    fieldNames.forEach((field) => {
      if (req.body[field] != null) admin[field] = req.body[field];
    });

    await admin.save();

    return Comman.setResponse(res, 200, true, "Bussiness information updated.");
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
