const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    leaveType: {
      type: String,
      enum: ["casual", "sick", "paid", "unpaid"],
    },
    startDayType: {
      type: String,
      enum: ["full day", "first half", "second half"],
    },
    endDayType: {
      type: String,
      enum: ["full day", "first half", "second half"],
    },
    reason: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "approve", "unapprove"],
      default: "pending",
    },
    description: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
