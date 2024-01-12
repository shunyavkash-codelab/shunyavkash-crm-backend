const mongoose = require("mongoose");
const validator = require("validator");

const clientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    gender: {
      type: String,
    },
    profile_img: {
      type: String,
      default: null,
    },
    status: {
      type: Number,
      default: 0, // 0 - active , 1 - deactive
    },
    bankName: {
      type: String,
    },
    IFSC: {
      type: String,
    },
    holderName: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
  },

  { timestamps: true, versionKey: false }
);

clientSchema.index({ email: 1 }, { unique: true });
const Client = mongoose.model("Client", clientSchema);
module.exports = Client;
