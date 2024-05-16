const { default: mongoose } = require("mongoose");
const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Pagination = require("../../middleware/pagination");
const Notification = require("../../model/notification");
var Model = Notification;

exports.get = asyncHandler(async (req, res, next) => {
  try {
    await Notification.updateMany(
      { receiver: req.user._id, readAll: false },
      { $set: { readAll: true } },
      { new: true }
    );
    const aggregate = [
      {
        $match: {
          receiver: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender_info",
          pipeline: [
            {
              $project: {
                name: 1,
                profile_img: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$sender_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "itemId",
          foreignField: "_id",
          as: "client_info",
          pipeline: [
            {
              $project: {
                name: 1,
                profile_img: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$client_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "itemId",
          foreignField: "_id",
          as: "project_info",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$project_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "invoices",
          localField: "itemId",
          foreignField: "_id",
          as: "invoice_info",
          pipeline: [
            {
              $project: {
                invoiceNumber: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$invoice_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          textname: {
            $cond: [
              "$project_info",
              "$project_info.name",
              {
                $cond: [
                  "$client_info",
                  "$client_info.name",
                  {
                    $cond: [
                      "$invoice_info",
                      "$invoice_info.invoiceNumber",
                      {
                        $cond: [
                          { $eq: ["$type", "my-salary"] },
                          undefined,
                          "$sender_info.name",
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    ];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get notifications successfully.",
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

exports.getCount = asyncHandler(async (req, res, next) => {
  try {
    const result = await Notification.countDocuments({
      receiver: req.user._id,
      readAll: false,
    });
    return Comman.setResponse(
      res,
      200,
      true,
      "Get notifications count successfully.",
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
