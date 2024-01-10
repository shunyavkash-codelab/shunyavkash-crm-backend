const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    // projectId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Project",
    // },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // taskIds: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   ref: "Task",
    // },
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
    },
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    invoiceDate: {
      type: Date,
    },
    invoiceDueDate: {
      type: Date,
    },
    from: {
      type: Object,
    },
    to: {
      type: Object,
    },
    // project: {
    //   type: Object,
    // },
    tasks: {
      type: [Object],
    },
    bank: {
      type: Object,
    },
    note: {
      type: String,
    },
    signature: {
      type: String,
    },
    totals: {
      type: Object,
    },
    status: {
      type: String,
      enum: ["success", "pending"],
      default: "pending",
    },
    watermark: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
