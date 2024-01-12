const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const salarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "unpaid"],
      required: true,
    },
    incentive: {
      type: Number,
    },
  },

  { timestamps: true, versionKey: false }
);

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;
