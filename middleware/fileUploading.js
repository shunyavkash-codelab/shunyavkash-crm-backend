const cloudinary = require("cloudinary");
const fs = require("fs").promises;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.fileUploading = async (file) => {
  try {
    let filename =
      "./temp/" +
      Date.now() +
      "_" +
      Math.ceil(Math.random() * 1e8) +
      "." +
      file.mimetype.split("/")[1];
    await fs.writeFile(filename, file.data);
    return new Promise(async (resolve, reject) => {
      const data = await cloudinary.uploader.upload(filename);
      if (data) {
        await fs.unlink(filename);
        return resolve(data.secure_url);
      } else {
        return reject(data);
      }
    });
  } catch (error) {
    return console.log(error);
  }
};
