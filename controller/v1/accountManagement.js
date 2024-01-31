const { default: mongoose } = require("mongoose");
const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Pagination = require("../../middleware/pagination");
const accountManagement = require("../../model/accountManagement");
const { validationResult } = require("express-validator");
const { fileUploading } = require("../../middleware/fileUploading");
var Model = accountManagement;

let fieldNames = [
  "date",
  "title",
  "description",
  "amount",
  "invoiceType",
  "invoiceOwner",
  "paymentMethod",
  "expanseType",
  "collaborator",
  "invoiceUpload",
];

// add account
exports.add = asyncHandler(async (req, res, next) => {
  try {
    req.body.userId = req.user._id;
    fieldNames.forEach((field) => {
      if (req.body[field] != null) req.body[field];
    });
    if (req.files?.invoiceUpload) {
      req.body.invoiceUpload = await fileUploading(req.files.invoiceUpload);
    }
    const addAccount = await Model.create(req.body);

    return Comman.setResponse(
      res,
      201,
      true,
      `${req.body.type} added successfully`,
      addAccount
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

// Get Account management
exports.getAccountList = asyncHandler(async (req, res, next) => {
  try {
    let obj = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      obj["$or"] = [
        { title: { $regex: searchRegex } },
        { invoiceOwner: { $regex: searchRegex } },
      ];
    }
    if (req.query.from && req.query.to) {
      obj.date = {
        $gte: new Date(req.query.from + "T00:00:00.000Z"),
        $lte: new Date(req.query.to + "T23:59:59.999Z"),
      };
    }
    if (req.query.filter) {
      obj.type = req.query.filter;
    }
    let aggregate = [
      {
        $match: obj,
      },
      {
        $lookup: {
          from: "clients",
          localField: "collaborator",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "collaborator",
        },
      },
      {
        $addFields: {
          collaborator: {
            $first: "$collaborator.name",
          },
        },
      },
    ];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get account management successfully.",
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

// Account dashboard
exports.accountDashboard = asyncHandler(async (req, res, next) => {
  try {
    const accountDashboard = await Model.aggregate([
      {
        $facet: {
          total_sales: [
            {
              $match: {
                type: "income",
                collaborator: {
                  $exists: true,
                },
              },
            },
            {
              $group: {
                _id: null,
                count: {
                  $sum: "$amount",
                },
              },
            },
          ],
          total_income: [
            {
              $match: {
                type: "income",
              },
            },
            {
              $group: {
                _id: "$type",
                count: {
                  $sum: "$amount",
                },
              },
            },
          ],
          total_expense: [
            {
              $match: {
                type: "expense",
              },
            },
            {
              $group: {
                _id: "$type",
                count: {
                  $sum: "$amount",
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalSales: {
            $cond: [
              { $first: "$total_sales.count" },
              { $first: "$total_sales.count" },
              0,
            ],
          },
          totalIncome: {
            $cond: [
              { $first: "$total_income.count" },
              { $first: "$total_income.count" },
              0,
            ],
          },
          totalExpense: {
            $cond: [
              { $first: "$total_expense.count" },
              { $first: "$total_expense.count" },
              0,
            ],
          },
        },
      },

      {
        $addFields: {
          totalBalance: {
            $subtract: ["$totalIncome", "$totalExpense"],
          },
        },
      },
    ]);
    return Comman.setResponse(
      res,
      200,
      true,
      "Account dashboard",
      accountDashboard[0]
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

// get singal transaction
exports.viewTransaction = asyncHandler(async (req, res, next) => {
  try {
    let transactionId = req.params.id;
    const viewTransaction = await Model.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(transactionId) } },
      {
        $lookup: {
          from: "clients",
          localField: "collaborator",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "collaborator",
        },
      },
      {
        $addFields: {
          collaborator: {
            $first: "$collaborator._id",
          },
        },
      },
    ]);
    return Comman.setResponse(
      res,
      200,
      true,
      "View transaction",
      viewTransaction[0]
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

// edit transaction
exports.editTransaction = asyncHandler(async (req, res, next) => {
  try {
    let transactionId = req.params.id;
    fieldNames.forEach((field) => {
      if (req.body[field] != null) res.record[field] = req.body[field];
    });
    if (req.files?.invoiceUpload) {
      res.record.invoiceUpload = await fileUploading(req.files.invoiceUpload);
    }
    await Model.updateOne(
      { _id: transactionId },
      { $set: res.record },
      { new: true }
    );
    return Comman.setResponse(
      res,
      200,
      true,
      "Update transaction successfully."
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

// delete transaction
exports.deleteTransaction = asyncHandler(async (req, res, next) => {
  try {
    await Model.findByIdAndDelete(req.params.id);
    return Comman.setResponse(
      res,
      200,
      true,
      "Transaction delete successfully."
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
