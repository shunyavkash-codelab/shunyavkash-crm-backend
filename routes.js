var express = require("express");
var cors = require("cors");
var router = express.Router();
var clientRouter = require("./routes/client");
var userRouter = require("./routes/user");
var defaultRoutes = require("./routes/default");
var projectRouter = require("./routes/project");
var bankRouter = require("./routes/bank");
var dashboardRouter = require("./routes/dashboard");
var invoiceRouter = require("./routes/invoice");
const Country = require("./model/country");
const Comman = require("./middleware/comman");
const Currency = require("./model/currency");
var adminRouter = require("./routes/admin");
var taskRouter = require("./routes/task");
var leaveRouter = require("./routes/leave");
var salaryRouter = require("./routes/salary");
var { fileUploading } = require("./middleware/fileUploading");
const { Result } = require("express-validator");

// Allows cross-origin requests
var allowedOrigins = [
  "http://localhost:3000",
  "https://shunyavkash-crm-frontend-2q8l7pc3o.vercel.app",
  "https://shunyavkash-crm-frontend.vercel.app",
];
router.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // Allow requests with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
  })
);

// router
router.use("/client", clientRouter);
router.use("/user", userRouter);
router.use("/project", projectRouter);
router.use("/bank", bankRouter);
router.use("/dashboard", dashboardRouter);
router.use("/admin", adminRouter);
router.use("/invoice", invoiceRouter);
router.use("/task", taskRouter);
router.use("/leave", leaveRouter);
router.use("/salary", salaryRouter);

router.get("/country-code", async (req, res) => {
  let countryList = await Country.find();
  Comman.setResponse(
    res,
    200,
    true,
    "Get country code successfully.",
    countryList
  );
});

router.get("/currency", async (req, res) => {
  let currencyList = await Currency.find();
  Comman.setResponse(
    res,
    200,
    true,
    "Get currency successfully.",
    currencyList
  );
});

// file uploading
router.post("/file-uploading", async (req, res) => {
  try {
    let data = await fileUploading(req.files.files);
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

// set default routes
router.use("*", defaultRoutes);

module.exports = router;
