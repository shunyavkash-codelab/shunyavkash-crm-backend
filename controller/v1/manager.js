const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const bcrypt = require("bcrypt");
const Pagination = require("../../middleware/pagination");
const Manager = require("../../model/manager");
var Model = Manager;

// use edit manager field
const fieldNames = [
  "name",
  "companyName",
  "companyLogo",
  "websiteURL",
  "mobileCode",
  "mobileNumber",
  "address",
  "profile_img",
  "signature",
];

// registration
exports.signup = asyncHandler(async (req, res, next) => {
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
    const registration = await Model.create({
      name: req.body.name,
      companyName: req.body.companyName,
      companyLogo: req.body.companyLogo,
      profile_img: req.body.profile_img,
      websiteURL: req.body.websiteURL,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password || null, 10),
      mobileCode: req.body.mobileCode,
      mobileNumber: req.body.mobileNumber,
      gender: req.body.gender,
      address: req.body.address,
      signature: req.body.signature,
    });
    return Comman.setResponse(
      res,
      201,
      true,
      "Registration completed successfully.",
      registration
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

//login
exports.login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password, mobileNumber } = req.body;
    const check = await Model.findOne({
      $or: [{ email: email }, { mobileNumber: mobileNumber }],
    }).select("+password");
    if (!check) {
      return Comman.setResponse(res, 404, false, "user does not exist");
    }
    if (!(await bcrypt.compare(password, check.password)))
      return Comman.setResponse(res, 401, false, "Incorrect password.");

    delete check._doc.password;
    // generate tokens
    const accessToken = await check.generateAuthToken();
    check._doc.token = accessToken;

    return Comman.setResponse(res, 200, true, "Login successfully", check);
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

// get single manager
exports.getManagerById = asyncHandler(async (req, res, next) => {
  try {
    return Comman.setResponse(
      res,
      200,
      true,
      "Get client successfully.",
      res.record
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

// get multiple manager
exports.getManagers = asyncHandler(async (req, res, next) => {
  try {
    const aggregate = [];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get managers successfully.",
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

// edit manager detile
exports.editManager = asyncHandler(async (req, res, next) => {
  try {
    // check login managerID and edit managerID
    if (req.user.id.toString() !== req.params.id) {
      return Comman.setResponse(
        res,
        401,
        false,
        "Unauthorized access to this route."
      );
    }
    fieldNames.forEach((field) => {
      if (req.body[field] != null) res.record[field] = req.body[field];
    });
    await Model.updateOne({ _id: req.params.id }, res.record, { new: true });
    return Comman.setResponse(res, 200, true, "Update manager successfully.");
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
