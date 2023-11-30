const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb is connected", con.connection.host);
  } catch (error) {
    console.log(error);
  }
};
