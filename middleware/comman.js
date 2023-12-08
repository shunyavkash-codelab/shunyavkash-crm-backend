const { validationResult } = require("express-validator");
const Client = require("../model/client");
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
    return Comman.setResponse(res, 400, false, "email address not valid.", {
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

module.exports = Comman;
