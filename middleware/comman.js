const { validationResult } = require("express-validator");
const Client = require("../model/client");
const Invoice = require("../model/invoice");
const InvoiceNumber = require("../model/invoiceNumber");
let Comman = {};

Comman.setResponse = (res, code, flag, message, data = {}) => {
  let statusCode = code;
  let responseStatus = flag;
  let responseMessage = message;
  let responseData = data;
  res.status(statusCode).json({
    code: statusCode,
    success: responseStatus,
    message: responseMessage,
    data: responseData,
  });
};

Comman.errorHandal = (req, res, next) => {
  // validate the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Comman.setResponse(res, 400, false, "Required params not found.", {
      errors: errors.array(),
    });
  }
  next();
};

Comman.uniqueEmail = async (model, email) => {
  try {
    const checkEmail = await model.findOne({ email: email });
    if (checkEmail) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
  }
};

Comman.uniqueMobile = async (model, mobile) => {
  try {
    const checkMobile = await model.findOne({ mobileNumber: mobile });
    if (checkMobile) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
  }
};

Comman.generateInvoiceNumber = async () => {
  try {
    // Create a new Date object
    let currentDate = new Date();

    // Get the year, month, and day components
    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed, so we add 1
    let day = currentDate.getDate().toString().padStart(2, "0");

    // Concatenate the components to get the desired format
    let formattedDate = `${year}${month}${day}`;
    let invoiceNumber = "";
    let latestNum = await InvoiceNumber.findOne({ year: year });
    if (latestNum && year == latestNum.year) {
      let incNum = latestNum.number + 1;
      let formattedNumber = incNum.toString().padStart(3, "0");
      invoiceNumber = `${formattedDate}${formattedNumber}`;
      const checkNumber = await Invoice.findOne({
        invoiceNumber: invoiceNumber,
      });
      if (checkNumber) {
        invoiceNumber = (Number(invoiceNumber) + 1).toString();
        latestNum.number = latestNum.number + 1;
        await latestNum.save();
      }
      return invoiceNumber;
    } else {
      await InvoiceNumber.create({ year: year });
      let incNum = 1;
      let formattedNumber = incNum.toString().padStart(3, "0");
      invoiceNumber = `${formattedDate}${formattedNumber}`;
      return invoiceNumber;
    }
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

Comman.incrementInvoiceNumber = async () => {
  try {
    // Create a new Date object
    let currentDate = new Date();

    // Get the year components
    let year = currentDate.getFullYear();
    let latestNum = await InvoiceNumber.findOne({ year: year });
    if (latestNum) {
      latestNum.number = latestNum.number + 1;
      await latestNum.save();
      return;
    } else {
      await InvoiceNumber.create({ year: year, number: 1 });
      return;
    }
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

module.exports = Comman;
