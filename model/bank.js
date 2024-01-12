const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    holderName: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    IFSC: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    defaultBank: {
      type: Boolean,
    },
  },

  { timestamps: true, versionKey: false }
);

bankSchema.index({ accountNumber: 1 }, { unique: true });
const Bank = mongoose.model("Bank", bankSchema);
module.exports = Bank;
