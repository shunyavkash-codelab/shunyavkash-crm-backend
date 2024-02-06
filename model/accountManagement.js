const mongoose = require("mongoose");

const accountManagementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    invoiceType: {
      type: String,
      enum: ["inbound", "outbound"],
    },
    invoiceOwner: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["bankTransfer", "cash", "upi"],
    },
    collaborator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    invoiceUpload: {
      type: String,
    },
    expenseType: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const AccountManagement = mongoose.model(
  "AccountManagement",
  accountManagementSchema
);
module.exports = AccountManagement;
