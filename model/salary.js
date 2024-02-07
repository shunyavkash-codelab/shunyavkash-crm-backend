const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
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
    date: {
      type: Date,
    },
    pdf: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true, versionKey: false }
);

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;
