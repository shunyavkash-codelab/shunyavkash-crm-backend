const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    leaveType: {
      type: String,
      enum: ["Casual", "Sick", "Paid", "Unpaid"],
    },
    dayType: {
      type: String,
      enum: ["Full day", "First half", "Second half"],
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
      enum: ["approve", "unapprove"],
    },
    description: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
