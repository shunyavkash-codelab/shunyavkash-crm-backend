const cloudinary = require("cloudinary");
const fs = require("fs").promises;
const path = require("path");
const html_to_pdf = require("html-pdf-node");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.generatePDF = async (dynamicData) => {
  const htmlContent = await fs.readFile(
    path.join(__dirname, "../public/salarySlipTemplate.html"),
    "utf-8"
  );

  const replacedHtmlContent = replacePlaceholders(htmlContent, dynamicData);

  // Generate PDF
  let options = { format: "A4" };
  let file = { content: replacedHtmlContent };

  let filename = path.join(
    __dirname,
    "../temp/" + Date.now() + "_" + Math.ceil(Math.random() * 1e8) + ".pdf"
  );
  return html_to_pdf.generatePdf(file, options).then(async (pdfBuffer) => {
    await fs.writeFile(filename, pdfBuffer);
    return new Promise(async (resolve, reject) => {
      const data = await cloudinary.uploader.upload(filename);
      if (data) {
        await fs.unlink(filename);
        return resolve(data.secure_url);
      } else {
        return reject(data);
      }
    });
  });

  function replacePlaceholders(html, data) {
    // Replace placeholders in the HTML content
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const placeholder = new RegExp(`{{${key}}}`, "g");
        html = html.replace(placeholder, data[key]);
      }
    }
    return html;
  }
};
