const { default: mongoose } = require("mongoose");
const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Pagination = require("../../middleware/pagination");
const Client = require("../../model/client");
const { validationResult } = require("express-validator");
const { fileUploading } = require("../../middleware/fileUploading");
const Notification = require("../../model/notification");
const User = require("../../model/user");
var Model = Client;

// use edit client field
const fieldNames = [
  "name",
  "companyName",
  "websiteURL",
  "email",
  "mobileCode",
  "mobileNumber",
  "address",
  "bankName",
  "IFSC",
  "holderName",
  "accountNumber",
];

// create client
exports.add = asyncHandler(async (req, res, next) => {
  try {
    const checkEmail = await Comman.uniqueEmail(Model, req.body.email);
    if (!checkEmail) {
      return Comman.setResponse(
        res,
        409,
        false,
        "This email address already exists."
      );
    }
    const checkMobile = await Comman.uniqueMobile(Model, req.body.mobileNumber);
    if (!checkMobile) {
      return Comman.setResponse(
        res,
        409,
        false,
        "This mobile number already exists."
      );
    }
    let obj = {};
    fieldNames.forEach((field) => {
      if (req.body[field] != null) obj[field] = req.body[field];
    });
    obj.userId = req.user._id;
    if (req.files) {
      const entries = Object.entries(req.files);

      for (const [key, value] of entries) {
        let url = await fileUploading(value);
        obj[key] = url;
      }
    }
    const client = await Model.create(obj);
    const admin = await User.findOne({ role: 0 }).select("_id");
    const notiObj = {
      sender: req.user._id,
      receiver: admin._id,
      text: ` client added in our company.`,
      itemId: client._id,
      type: "clients",
    };
    await Comman.createNotification(notiObj);
    return Comman.setResponse(
      res,
      201,
      true,
      "Client added successfully.",
      client
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

// get single client
exports.getClientById = asyncHandler(async (req, res, next) => {
  try {
    let client = await Model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
          status: 0,
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
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "clientId",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
            {
              $limit: 5,
            },
          ],
          as: "project",
        },
      },
      {
        $addFields: {
          userName: {
            $first: "$userName.name",
          },
          projectName: {
            $map: {
              input: "$project",
              as: "projectItem",
              in: "$$projectItem.name",
            },
          },
        },
      },
      {
        $unset: "project",
      },
    ]);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get client successfully.",
      client[0]
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

// get multiple client
exports.getClients = asyncHandler(async (req, res, next) => {
  try {
    let search = { status: 0 };
    if (req.query.search) {
      search = { name: { $regex: req.query.search, $options: "i" } };
    }
    const aggregate = [
      { $match: search },
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
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "clientId",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
            {
              $limit: 5,
            },
          ],
          as: "project",
        },
      },
      {
        $addFields: {
          userName: {
            $first: "$userName.name",
          },
          projectName: {
            $map: {
              input: "$project",
              as: "projectItem",
              in: "$$projectItem.name",
            },
          },
        },
      },
    ];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get clients successfully.",
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

// edit client
exports.editClient = asyncHandler(async (req, res, next) => {
  try {
    fieldNames.forEach((field) => {
      if (req.body[field] != null) res.record[field] = req.body[field];
    });
    if (req.files) {
      const entries = Object.entries(req.files);

      for (const [key, value] of entries) {
        let url = await fileUploading(value);
        res.record[key] = url;
      }
    }
    await Model.updateOne({ _id: req.params.id }, res.record, { new: true });
    return Comman.setResponse(res, 200, true, "Update client successfully.");
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

// delete client
exports.deleteClient = asyncHandler(async (req, res, next) => {
  try {
    await Model.updateOne({ _id: req.params.id }, { status: 1 }, { new: true });
    return Comman.setResponse(res, 200, true, "Delete client successfully.");
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
