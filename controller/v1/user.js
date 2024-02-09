const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const bcrypt = require("bcrypt");
const Pagination = require("../../middleware/pagination");
const sendMail = require("../../utils/mailer");
const User = require("../../model/user");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { validationResult } = require("express-validator");
const { fileUploading } = require("../../middleware/fileUploading");
var Model = User;

// use edit user field
const fieldNames = [
  "name",
  "companyName",
  "websiteURL",
  "mobileCode",
  "mobileNumber",
  "address",
  "address2",
  "landmark",
  "pincode",
  "role",
  "ctc",
  "designation",
  "employeeId",
  "isInvited",
  "isDeleted",
  "isActive",
  "gender",
  "dob",
  "hobbies",
  "phobia",
  "whatsappNumber",
  "personalEmail",
  "fatherName",
  "fatherNumber",
  "motherName",
  "signature",
  "degreeCertification",
  "adharCard",
  "addressProof",
  "propertyTax",
  "electricityBill",
  "dateOfJoining",
];

const formFile = [
  "signature",
  "degreeCertification",
  "adharCard",
  "addressProof",
  "propertyTax",
  "electricityBill",
];

// add user by admin
exports.addEmployee = asyncHandler(async (req, res, next) => {
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
    let password = req.body.password;
    fieldNames.forEach((field) => {
      if (req.body[field] != null) req.body[field];
    });
    req.body.role =
      req.body.role == "superAdmin"
        ? 0
        : req.body.role == "manager"
        ? 1
        : req.body.role == "employee" && 2;
    req.body.password = await bcrypt.hash(req.body.password || null, 10);
    if (req.files?.profile_img) {
      req.body.profile_img = await fileUploading(req.files.profile_img);
    }
    const registration = await Model.create(req.body);
    const admin = await Model.findOne({ role: 0 });
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

    await sendMail(req.body.email, subject, message);
    return Comman.setResponse(
      res,
      201,
      true,
      `${req.body.role} added successfully.`,
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
    const { email, password } = req.body;
    const check = await Model.findOne({ email: email }).select("+password");
    if (!check || check.isDeleted) {
      return Comman.setResponse(res, 404, false, "user does not exist");
    }
    if (check.isActive == false) {
      return Comman.setResponse(
        res,
        401,
        false,
        "Your account is deactivated. Please contact the admin for assistance."
      );
    }
    if (!(await bcrypt.compare(password, check.password)))
      return Comman.setResponse(
        res,
        401,
        false,
        "Incorrect password or email."
      );

    delete check._doc.password;
    // generate tokens
    const accessToken = await check.generateAuthToken();
    check._doc.token = accessToken;
    check.invitationStatus = 1;
    await check.save();

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
  let email = req.body.email;
  const user = await Model.findOne({ email: email });
  const accessToken = await user.generateAuthToken();
  // return console.log(accessToken);
  if (!user) {
    return Comman.setResponse(res, 404, false, "user does not exist");
  }
  const subject = "Forget Password";
  const message =
    `<div style="font-size:16px"><span style="font-size:18px;">Hi ${user.name}!</span><br/> Forgot your password? No worries just click this link to reset it.<br />` +
    `<br />Tired of remembering your password? Let CRM remember it for you! Just let your smartphone autofill and remember your password!<br /><br />` +
    `<a style="text-decoration: none; background-color:green;padding:8px 16px; color:white" href="${process.env.DOMAIN}/confirm-password?key=${accessToken}">Reset Password</a></div>`;
  await sendMail(email, subject, message)
    .then(async (re) => {
      user.resetPasswordToken = accessToken;
      user.resetPasswordDate = new Date();
      await user.save();
      return Comman.setResponse(
        res,
        200,
        true,
        `Email is sent on ${user.email} please check your email.`
      );
    })
    .catch((e) => next(e));
});

// reset password (forgot password)
exports.resetPassword = asyncHandler(async (req, res, next) => {
  let key = req.query.key;
  jwt.verify(key, process.env.JWT_SECRET_KEY, async (err, user) => {
    if (err) return res.status(401).send({ message: err.message });
    let existUser = await User.findById(user.id);
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
  let oldPassword = req.body.oldPassword;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;

  const user = await Model.findOne({ _id: req.user.id }).select("+password");
  if (!(await bcrypt.compare(oldPassword, user.password))) {
    return Comman.setResponse(res, 401, false, "Old password is incorrect.");
  }
  if (password !== confirmPassword)
    return Comman.setResponse(
      res,
      401,
      false,
      "Your password and confirmation password do not match."
    );

  (user.password = await bcrypt.hash(password || null, 10)), await user.save();
  return Comman.setResponse(res, 200, true, "Password change successful.");
});

// get single user
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await Model.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id),
      },
    },
    // {
    //   $lookup: {
    //     from: "users",
    //     localField: "reference",
    //     foreignField: "_id",
    //     pipeline: [
    //       {
    //         $project: {
    //           name: 1,
    //         },
    //       },
    //     ],
    //     as: "user",
    //   },
    // },
    // {
    //   $addFields: {
    //     referenceName: {
    //       $first: "$user.name",
    //     },
    //   },
    // },
    // {
    //   $unset: "user",
    // },
  ]);
  try {
    return Comman.setResponse(
      res,
      200,
      true,
      "Get user successfully.",
      user[0]
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

// get multiple user by manager role wise
exports.getManagers = asyncHandler(async (req, res, next) => {
  try {
    let search = { role: 1, isDeleted: false };
    if (req.query.search) {
      search.name = { $regex: req.query.search, $options: "i" };
    }
    const aggregate = [{ $match: search }];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get users successfully.",
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

// edit user details
exports.editUser = asyncHandler(async (req, res, next) => {
  try {
    fieldNames.forEach((field) => {
      if (req.body[field] != null) res.record[field] = req.body[field];
    });
    if (req.files?.profile_img) {
      res.record.profile_img = await fileUploading(req.files.profile_img);
    }

    if (req.files) {
      for (const file of formFile) {
        if (req.files[file] !== undefined)
          res.record[file] = await fileUploading(req.files[file]);
      }
    }
    await Model.updateOne({ _id: req.params.id }, res.record, { new: true });
    return Comman.setResponse(res, 200, true, "Update user successfully.");
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

// get multiple employees
exports.getEmployees = asyncHandler(async (req, res, next) => {
  try {
    let search = { role: 2, invitationStatus: 1, isDeleted: false };
    if (req.query.search) {
      search.name = { $regex: req.query.search, $options: "i" };
    }
    const aggregate = [{ $match: search }];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get employee successfully.",
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

// get all user/employee
exports.getAllEmployees = asyncHandler(async (req, res, next) => {
  try {
    let search = { role: 2, isDeleted: false };
    if (req.query.search) {
      search.name = { $regex: req.query.search, $options: "i" };
    }
    const aggregate = [{ $match: search }];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get employee successfully.",
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

// get all User
exports.getAllUser = asyncHandler(async (req, res, next) => {
  try {
    let search = {};
    if (req.query.search) {
      search.name = { $regex: req.query.search, $options: "i" };
    }
    // const aggregate = [{ $match: search }, { $project: { name: 1 } }];
    // const result = await Pagination(req, res, Model, aggregate);
    let result = await Model.find(search).select("name profile_img isActive");
    return Comman.setResponse(
      res,
      200,
      true,
      "Get All employee successfully.",
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

// get invited employees
exports.getInvitedEmployees = asyncHandler(async (req, res, next) => {
  try {
    let search = { isInvited: true, isDeleted: false };
    if (req.query.search) {
      search.name = { $regex: req.query.search, $options: "i" };
    }
    const aggregate = [{ $match: search }];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get Invited employee successfully.",
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

// delete employee and user
exports.deleteEmployee = asyncHandler(async (req, res, next) => {
  try {
    await Model.findByIdAndUpdate(
      res.record._id,
      { isDeleted: true },
      { new: true }
    );
    return Comman.setResponse(res, 200, true, "Deleted successfully.");
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

// get Member dashboard
exports.memberDashboard = asyncHandler(async (req, res, next) => {
  try {
    const aggregate = [
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          manager: {
            $sum: {
              $cond: [
                {
                  $eq: ["$role", 1],
                },
                1,
                0,
              ],
            },
          },
          employee: {
            $sum: {
              $cond: [
                {
                  $eq: ["$role", 2],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ];
    const result = await Model.aggregate(aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Get Invited employee successfully.",
      result[0]
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
