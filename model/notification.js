const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      require: true,
      enum: [
        "clients",
        "invoices",
        "leaves-requests",
        "projects",
        "my-salary",
        "my-leave",
      ],
    },
    readAll: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  { timestamps: true, versionKey: false }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
