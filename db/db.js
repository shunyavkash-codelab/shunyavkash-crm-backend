const mongoose = require("mongoose");
const Manager = require("../model/manager");

exports.connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb is connected", con.connection.host);
    let admin = await Manager.findOne({
      email: "hiren.polara@shunyavkash.com",
    });
    if (!admin) {
      await Manager.create({
        name: "hiren",
        companyName: "shunyavkash",
        email: "hiren.polara@shunyavkash.com",
        password:
          "$2b$10$BG/MyMnf2I7fUSc2SR3upeZQ.KddgY1m9FYoqAeZp/RqXNLdjBvj.",
        mobileCode: "+91",
        mobileNumber: "9876567890",
        address: "311, Ambika Pinnacle, Mota Varachha, Surat, Gujarat",
        address2: " Near Lajamni Chowk,",
        landmark: "Maruti Dham Society",
        pincode: "394101",
        gender: "male",
        profile_img:
          "https://plm-staging.s3.amazonaws.com/profiles/65264e33d2ac619310e6687a?v=27",
        role: 0,
        invitationStatus: 1,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
