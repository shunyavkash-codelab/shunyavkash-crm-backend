const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Pagination = require("../../middleware/pagination");
const Invoice = require("../../model/invoice");
const InvoiceNumber = require("../../model/invoiceNumber");
const Model = Invoice;

exports.generateInvoiceNum = asyncHandler(async (req, res, next) => {
  try {
    let newInvoice = await Comman.generateInvoiceNumber();
    return Comman.setResponse(
      res,
      200,
      true,
      "New invoice number generate successfully.",
      newInvoice
    );
  } catch (error) {
    Comman.setResponse(res, 400, false, "Something went wrong, please retry");
  }
});

// add invoice
exports.addInvoice = asyncHandler(async (req, res, next) => {
  try {
    let currDate = new Date();
    let year = currDate.getFullYear();
    const invoiceNumber = await InvoiceNumber.findOne({ year: year });
    // await Model.create(req.body);

    let DatabaseNumber = invoiceNumber.number.toString().padStart(3, "0");
    let reqNumber = req.body.invoiceNumber.toString().slice(8);
    if (Number(DatabaseNumber) + 1 == reqNumber) {
      console.log("innn");
      Comman.incrementInvoiceNumber();
    }
    return Comman.setResponse(res, 201, true, "Create invoice successfully");
  } catch (error) {
    Comman.setResponse(res, 400, false, "Something went wrong, please retry");
  }
});

// check invoice number already exit or not
exports.checkInvoiceNum = asyncHandler(async (req, res, next) => {
  try {
    let invoiceNo = req.params.id;
    const checkInvoiceNo = await Model.findOne({
      invoiceNumber: invoiceNo,
    });
    console.log(checkInvoiceNo);
    if (checkInvoiceNo) {
      return Comman.setResponse(
        res,
        200,
        false,
        "Invoice number already exist."
      );
    }

    return Comman.setResponse(res, 200, true, "Invoice number is available");
  } catch (error) {
    Comman.setResponse(res, 400, false, "Something went wrong, please retry");
  }
});

// get invoice list
exports.invoiceList = asyncHandler(async (req, res, next) => {
  try {
    let search = {};
    if (req.query.search) {
      search = { invoiceNumber: { $regex: req.query.search, $options: "i" } };
    }
    const aggregate = [
      { $match: search },
      {
        $lookup: {
          from: "managers",
          localField: "managerId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "managerName",
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "projectId",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "projectName",
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "_id",
          foreignField: "clientId",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "clientName",
        },
      },
      {
        $addFields: {
          managerName: {
            $first: "$managerName.name",
          },
          projectName: {
            $first: "$managerName.name",
          },
          clientName: {
            $first: "$clientName.name",
          },
        },
      },
    ];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get invoices successfully.",
      result
    );
  } catch (error) {
    Comman.setResponse(res, 400, false, "Something went wrong, please retry");
  }
});
