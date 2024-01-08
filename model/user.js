const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
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
    },
    mobileNumber: {
      type: String,
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
      type: Number,
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
      enum: [0, 1, 2], // 0 - admin, 1 - user, 2 - employee
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
    invitationStatus: {
      type: Number,
      enum: [0, 1], // 0 - not accepted, 1 - accept
      default: 0,
    },
    isDeleted: {
      type: Number,
      enum: [0, 1], // 0 - not deleted, 1 - deleted
      default: 0,
    },
    status: {
      type: Number,
      enum: [0, 1], // 0 - active, 1 - deactive
      default: 0,
    },
  },

  { timestamps: true, versionKey: false }
);
//Sign JWT and Return
userSchema.methods.generateAuthToken = async function () {
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

userSchema.index({ email: 1 }, { unique: true });
const User = mongoose.model("User", userSchema);

module.exports = User;
