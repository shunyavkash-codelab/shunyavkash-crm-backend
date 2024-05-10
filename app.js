var express = require("express");
require("dotenv").config();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var port = process.env.PORT;
const fileUpload = require("express-fileupload");

// config & db
require("./db/db").connectDB();

var router = require("./routes");
require("./cron");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use(router);

// Start the server
app.listen(port, () => console.log(`Server listening on ${port}`));
console.log(new Date(), "*************", " Server Started");
