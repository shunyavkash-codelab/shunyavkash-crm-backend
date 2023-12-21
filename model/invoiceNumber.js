const mongoose = require("mongoose");

const invoiceNumberSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      default: 0,
    },
    year: {
      type: Number,
      unique: true,
    },
  },
  { versionKey: false }
);

const InvoiceNumber = mongoose.model("InvoiceNumber", invoiceNumberSchema);
module.exports = InvoiceNumber;
