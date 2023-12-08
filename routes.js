var express = require("express");
var router = express.Router();
var clientRouter = require("./routes/client");
var managerRouter = require("./routes/manager");
var defaultRoutes = require("./routes/default");
var projectRouter = require("./routes/project");
var bankRouter = require("./routes/bank");
var dashbordRouter = require("./routes/dashboard");

// router
router.use("/client", clientRouter);
router.use("/manager", managerRouter);
router.use("/project", projectRouter);
router.use("/bank", bankRouter);
router.use("/dashbord", dashbordRouter);

// set default routes
router.use("*", defaultRoutes);

module.exports = router;
