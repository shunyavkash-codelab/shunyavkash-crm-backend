const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");

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
