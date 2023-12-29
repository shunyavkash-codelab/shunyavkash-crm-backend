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
    await Model.create(req.body);

    let DatabaseNumber = invoiceNumber.number.toString().padStart(3, "0");
    let reqNumber = req.body.invoiceNumber.toString().slice(8);
    if (Number(DatabaseNumber) + 1 == reqNumber) {
      Comman.incrementInvoiceNumber();
    }
    return Comman.setResponse(res, 201, true, "Create invoice successfully");
  } catch (error) {
    console.log(error.code, "-----------------37");
    if (error.code == 11000)
      return Comman.setResponse(
        res,
        409,
        false,
        "This invoice already generated."
      );
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
          localField: "projectId",
          foreignField: "_id",
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
          localField: "clientId",
          foreignField: "_id",
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

// get single invoice
exports.getInvoiceById = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Comman.setResponse(res, 400, false, "Required params not found.", {
      errors: errors.array(),
    });
  }
  try {
    let invoice = await Model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
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
          localField: "projectId",
          foreignField: "_id",
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
          localField: "clientId",
          foreignField: "_id",
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
      {
        $unset: "project",
      },
    ]);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get invoice successfully.",
      invoice[0]
    );
  } catch (error) {
    Comman.setResponse(res, 400, false, "Something went wrong, please retry");
  }
});
