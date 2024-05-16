var express = require("express");
require("dotenv").config();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const http = require("http");
const cors = require("cors");
const socket = require("socket.io");
var port = process.env.PORT;
const fileUpload = require("express-fileupload");

// config & db
require("./db/db").connectDB();

var app = express();
const cors_urls = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://shunyavkash-crm-frontend.vercel.app",
];

app.use(
  cors({
    origin: cors_urls,
    credentials: true,
  })
);
var router = require("./routes");
require("./cron");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use(router);

// socket

const server = http.createServer(app);
const io = new socket.Server(server, {
  cors: (cors, callback) => {
    if (cors_urls.includes(cors.headers["origin"])) {
      callback(null, { origin: true, credentials: false });
    } else {
      // callback(new Error("Not allowed by CORS"));
      callback(null, { origin: true, credentials: false });
    }
  },
});

const getKeyByValue = (obj, value) => {
  const entry = Object.entries(obj).find(([key, val]) => val === value);
  return entry ? entry[0] : null; // or undefined if you prefer
};

global.io = io;
global.users = {};

io.on("connection", (socket) => {
  console.log("connection");

  socket.on("connect_user", (data) => {
    global.users[data.userId] = socket.id;
    socket.emit("connected", "user connected.");
  });
  
  socket.on("disconnect", () => {
    const userId = getKeyByValue(global.users, socket.id);
    delete global.users[userId];
    console.log("disconnected");
  });
});

// Start the server
server.listen(port, () => console.log(`Server listening on ${port}`));
console.log(new Date(), "*************", " Server Started");
