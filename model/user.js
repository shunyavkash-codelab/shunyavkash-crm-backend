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
    profile_img: {
      type: String,
      default: null,
    },
    reference: {
      type: String,
    },
    signature: {
      type: String,
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
    isInvited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    dateOfJoining: {
      type: Date,
    },
    employeeId: {
      type: String,
    },
    designation: {
      type: String, // frontend, backend, organization
    },
    role: {
      type: Number,
      enum: [0, 1, 2], // 0 - admin, 1 - manager, 2 - employee
    },
    ctc: {
      type: Number,
    },
    gender: {
      type: String,
    },
    dob: {
      type: Date,
    },
    hobbies: {
      type: String,
    },
    phobia: {
      type: String,
    },
    personalEmail: {
      type: String,
      lowercase: true,
    },
    whatsappNumber: {
      type: String,
    },
    fatherName: {
      type: String,
    },
    fatherNumber: {
      type: String,
    },
    motherName: {
      type: String,
    },
    signature: {
      type: String,
    },
    degreeCertification: {
      type: String,
    },
    adharCard: {
      type: String,
    },
    addressProof: {
      type: String,
    },
    propertyTax: {
      type: String,
    },
    electricityBill: {
      type: String,
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
