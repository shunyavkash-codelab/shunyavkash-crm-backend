const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const bcrypt = require("bcrypt");
const Pagination = require("../../middleware/pagination");
const sendMail = require("../../utils/mailer");
const Manager = require("../../model/manager");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { validationResult } = require("express-validator");
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
  "address2",
  "landmark",
  "pincode",
  "profile_img",
  "signature",
];

// add manager by admin
exports.add = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Comman.setResponse(res, 400, false, "Required params not found.", {
      errors: errors.array(),
    });
  }
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

    //generate random password
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    const registration = await Model.create({
      name: req.body.name,
      companyName: req.body.companyName,
      companyLogo: req.body.companyLogo,
      profile_img: req.body.profile_img,
      websiteURL: req.body.websiteURL,
      email: req.body.email,
      password: await bcrypt.hash(password || null, 10),
      mobileCode: req.body.mobileCode,
      mobileNumber: req.body.mobileNumber,
      gender: req.body.gender,
      address: req.body.address,
      address2: req.body.address2,
      landmark: req.body.landmark,
      pincode: req.body.pincode,
      signature: req.body.signature,
      role: 1,
    });
    const admin = await Model.findOne({ role: 0 });
    let email = req.body.email;
    const subject = "Welcome to CRM - Your Login Credentials";
    const message = `<body
    style="font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;"
      >
        <div
          class="container"
          style="max-width: 600px;
      margin: 20px auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"
        >
          <h1 style="color: #333;">Welcome to CRM!</h1>
          <p style="color:#666;">Dear ${req.body.name}</p>
          <p style="color: #666;">
            We are excited to have you on board. Below are your login credentials:
          </p>

          <ul>
            <li>
              <strong>Email:</strong> ${req.body.email}
            </li>
            <li>
              <strong>Password:</strong> ${password}
            </li>
          </ul>

          <p>
            Please use the provided credentials to log in to the CRM platform. For
            security reasons, we recommend changing your password after the
            initial login.
          </p>

          <p>
            If you have any questions or need assistance, feel free to reach out
            to our support team at ${admin.email}.
          </p>

          <p>
            Thank you for choosing our CRM platform. We look forward to assisting
            you in managing your customer relationships effectively.
          </p>

          <a
            href="http://localhost:3000/signin"
            class="button"
            style="display: inline-block;
        padding: 10px 20px;
        background-color: #007BFF;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;"
          >
            Log In to CRM
          </a>
        </div>
      </body>`;

    await sendMail(email, subject, message);
    return Comman.setResponse(
      res,
      201,
      true,
      "Manager added successfully.",
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Comman.setResponse(res, 400, false, "Required params not found.", {
      errors: errors.array(),
    });
  }
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

//forget password
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Comman.setResponse(res, 400, false, "Required params not found.", {
      errors: errors.array(),
    });
  }
  let email = req.body.email;
  const manager = await Model.findOne({ email: email });
  const accessToken = await manager.generateAuthToken();
  // return console.log(accessToken);
  if (!manager) {
    return Comman.setResponse(res, 404, false, "user does not exist");
  }
  const subject = "Forget Password";
  const message =
    `<div style="font-size:16px"><span style="font-size:18px;">Hi ${manager.name}!</span><br/> Forgot your password? No worries just click this link to reset it.<br />` +
    `<br />Tired of remembering your password? Let CRM remember it for you! Just let your smartphone autofill and remember your password!<br /><br />` +
    `<a style="text-decoration: none; background-color:green;padding:8px 16px; color:white" href="http://localhost:3000/confirm-password?key=${accessToken}">Reset Password</a></div>`;
  await sendMail(email, subject, message)
    .then(async (re) => {
      manager.resetPasswordToken = accessToken;
      manager.resetPasswordDate = new Date();
      await manager.save();
      return Comman.setResponse(
        res,
        200,
        true,
        `Email is sent on ${manager.email} please check your email.`
      );
    })
    .catch((e) => next(e));
});

// reset password (forgot password)
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Comman.setResponse(res, 400, false, "Required params not found.", {
      errors: errors.array(),
    });
  }
  let key = req.query.key;
  jwt.verify(key, process.env.JWT_SECRET_KEY, async (err, user) => {
    if (err) return res.status(401).send({ message: err.message });
    let existUser = await Manager.findById(user.id);
    if (!existUser)
      return Comman.setResponse(res, 404, false, "User not found.");
    if (existUser.resetPasswordToken !== key) {
      return Comman.setResponse(
        res,
        419,
        false,
        "Your session has expired. Please open new reset password link."
      );
    }
    let timeDifference = new Date() - existUser.resetPasswordDate;
    if (timeDifference > 15 * 60 * 1000) {
      return Comman.setResponse(
        res,
        419,
        false,
        "Your session has expired. Please open new reset password link."
      );
    }
    existUser.password = await bcrypt.hash(req.body.password || null, 10);
    existUser.set({
      resetPasswordToken: undefined,
      resetPasswordDate: undefined,
    });

    await existUser.save();
    return Comman.setResponse(
      res,
      200,
      true,
      "Your password has been successfully changed."
    );
  });
});

// change Password (profile)
exports.changePassword = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Comman.setResponse(res, 400, false, "Required params not found.", {
      errors: errors.array(),
    });
  }
  let oldPassword = req.body.oldPassword;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;

  const manager = await Model.findOne({ _id: req.user.id }).select("+password");
  if (!(await bcrypt.compare(oldPassword, manager.password))) {
    return Comman.setResponse(res, 401, false, "Old password is incorrect.");
  }
  if (password !== confirmPassword)
    return Comman.setResponse(
      res,
      401,
      false,
      "Your password and confirmation password do not match."
    );

  (manager.password = await bcrypt.hash(password || null, 10)),
    await manager.save();
  return Comman.setResponse(res, 200, true, "Password change successful.");
});

// get single manager
exports.getManagerById = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Comman.setResponse(res, 400, false, "Required params not found.", {
      errors: errors.array(),
    });
  }
  const manager = await Model.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $lookup: {
        from: "managers",
        localField: "reference",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "manager",
      },
    },
    {
      $addFields: {
        referenceName: {
          $first: "$manager.name",
        },
      },
    },
    {
      $unset: "manager",
    },
  ]);
  try {
    return Comman.setResponse(
      res,
      200,
      true,
      "Get client successfully.",
      manager[0]
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

// edit manager details
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
