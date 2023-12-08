var express = require("express");
var cors = require("cors");
var router = express.Router();
var clientRouter = require("./routes/client");
var managerRouter = require("./routes/manager");
var defaultRoutes = require("./routes/default");
var projectRouter = require("./routes/project");
var bankRouter = require("./routes/bank");
var dashbordRouter = require("./routes/dashboard");
// Allows cross-origin requests
var allowedOrigins = ["http://localhost:3000"];
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
router.use("/manager", managerRouter);
router.use("/project", projectRouter);
router.use("/bank", bankRouter);
router.use("/dashbord", dashbordRouter);

// set default routes
router.use("*", defaultRoutes);

module.exports = router;
