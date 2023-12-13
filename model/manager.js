const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const managerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
    },
    websiteURL: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: [true, "client is registered on the given email"],
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please Enter Valid Email");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      select: false,
    },
    mobileCode: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: [true, "client is registered on the given mobile number"],
    },
    address: {
      type: String,
      trim: true,
    },
    address2: {
      type: String,
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
    },
    profile_img: {
      type: String,
      default: null,
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    signature: {
      type: String,
    },
    role: {
      type: Number,
      enum: [0, 1, 2], // 0 - admin, 1 - manager, 2 - employee
    },
    jobRole: {
      type: String, // frontend, backend, organization
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordDate: {
      type: Date,
    },
  },

  { timestamps: true, versionKey: false }
);
//Sign JWT and Return
managerSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE_IN }
  );
  return token;
};

managerSchema.index({ email: 1 }, { unique: true });
const Manager = mongoose.model("Manager", managerSchema);

module.exports = Manager;
