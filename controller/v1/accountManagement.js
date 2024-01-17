const { default: mongoose } = require("mongoose");
const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Pagination = require("../../middleware/pagination");
const accountManagement = require("../../model/accountManagement");
const { validationResult } = require("express-validator");
var Model = accountManagement;

// add account
exports.add = asyncHandler(async (req, res, next) => {
  try {
    req.body.userId = req.user._id;
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
    let aggregate = [];
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
            $first: "$total_sales.count",
          },
          totalIncome: {
            $first: "$total_income.count",
          },
          totalExpense: {
            $first: "$total_expense.count",
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
    const viewTransaction = await Model.findOne({ _id: transactionId });
    return Comman.setResponse(
      res,
      200,
      true,
      "View transaction",
      viewTransaction
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
