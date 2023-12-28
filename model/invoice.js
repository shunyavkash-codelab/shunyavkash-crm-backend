const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
    },
    taskIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Task",
    },
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
    dueDate: {
      type: Date,
    },
    from: {
      type: Object,
    },
    to: {
      type: Object,
    },
    project: {
      type: Object,
    },
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
  },
  { timestamps: true, versionKey: false }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;