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
    document.querySelector("#payDate").innerText = data.payDate;
    document.querySelector("#employeeName").innerText = data.employeeName;
    document.querySelector("#ctc").innerText = data.ctc || "N/A";
    document.querySelector("#employeeCode").innerText =
      data.employeeCode || "N/A";
    document.querySelector("#designation").innerText =
      data.designation || "N/A";
    document.querySelector("#presentDay").innerText = data.presentDay;
    // document.querySelector("#ifsc").innerText = data.ifsc;
    document.querySelector("#paidLeave").innerText = data.paidLeave;
    document.querySelector("#unpaidLeaveDays").innerText = data.unpaidLeaveDays;
    // document.querySelector("#bankAccNum").innerText = data.bankAccNum;
    // document.querySelector("#eligibleDay").innerText = data.eligibleDay;
    // document.querySelector("#bankName").innerText = data.bankName;
    document.querySelector("#basicSalary").innerText = data.basicSalary;
    document.querySelector("#specialAllowance").innerText =
      data.specialAllowance || 0;
    document.querySelector("#pf").innerText = data.pf || "0";
    document.querySelector("#professionalTax").innerText =
      data.professionalTax || "0";
    document.querySelector("#tds").innerText = data.tds || "0";
    document.querySelector("#incomeTotal").innerText = data.incomeTotal;
    document.querySelector("#deductionTotal").innerText = data.deductionTotal;
    document.querySelector("#netSalary").innerText = data.netSalary;
    document.querySelector("#netSalary1").innerText = data.netSalary;
    document.querySelector("#netSalaryInWord").innerText = data.netSalaryInWord;
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
