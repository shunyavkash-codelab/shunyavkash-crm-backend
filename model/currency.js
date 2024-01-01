const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    code: {
      type: String,
    },
    symbol: {
      type: String,
    },
  },
  { versionKey: false }
);

const Currency = mongoose.model("Currency", currencySchema);
module.exports = Currency;
