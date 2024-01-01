const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    label: {
      type: String,
    },
    code: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  { versionKey: false }
);

const Country = mongoose.model("Country", countrySchema);
module.exports = Country;
