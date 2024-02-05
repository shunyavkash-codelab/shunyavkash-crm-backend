const puppeteer = require("puppeteer");
const cloudinary = require("cloudinary");
const fs = require("fs").promises;
const path = require("path");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.generatePDF = async (dynamicData) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load the HTML content from the template file
  const htmlContent = await fs.readFile(
    path.join(__dirname, "../public/salarySlipTemplate.html"),
    "utf-8"
  );
  await page.setContent(htmlContent);
  await page.evaluate((data) => {
    document.querySelector("#month").innerText = data.month;
    document.querySelector("#employeeName").innerText = data.employeeName;
    document.querySelector("#ctc").innerText = data.ctc;
    document.querySelector("#employeeCode").innerText = data.employeeCode;
    document.querySelector("#designation").innerText = data.designation;
    document.querySelector("#presentDay").innerText = data.presentDay;
    document.querySelector("#ifsc").innerText = data.ifsc;
    document.querySelector("#paidLeave").innerText = data.paidLeave;
    document.querySelector("#unpaidLeaveDays").innerText = data.unpaidLeaveDays;
    document.querySelector("#bankAccNum").innerText = data.bankAccNum;
    document.querySelector("#eligibleDay").innerText = data.eligibleDay;
    document.querySelector("#bankName").innerText = data.bankName;
    document.querySelector("#basicSalary").innerText = data.basicSalary;
    document.querySelector("#specialAllowance").innerText =
      data.specialAllowance;
    document.querySelector("#pf").innerText = data.pf;
    document.querySelector("#professionalTax").innerText = data.professionalTax;
    document.querySelector("#tds").innerText = data.tds;
    document.querySelector("#incomeTotal").innerText = data.incomeTotal;
    document.querySelector("#deductionTotal").innerText = data.deductionTotal;
    document.querySelector("#netSalary").innerText = data.netSalary;
  }, dynamicData);
  let filename = path.join(
    __dirname,
    "../temp/" + Date.now() + "_" + Math.ceil(Math.random() * 1e8) + ".pdf"
  );
  //   Generate PDF
  await page.pdf({ path: filename, format: "A4", printBackground: true });
  return new Promise(async (resolve, reject) => {
    const data = await cloudinary.uploader.upload(filename);
    if (data) {
      await fs.unlink(filename);
      return resolve(data.secure_url);
    } else {
      return reject(data);
    }
  });
};
