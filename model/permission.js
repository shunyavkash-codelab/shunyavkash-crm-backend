const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    member: {
      type: Object,
      default: { read: false, write: false },
    },
    client: {
      type: Object,
      default: { read: false, write: false },
    },
    project: {
      type: Object,
      default: { read: false, write: false },
    },
    leaveRequest: {
      type: Object,
      default: { read: false, write: false },
    },
  },

  { versionKey: false }
);

const Permission = mongoose.model("Permission", permissionSchema);
module.exports = Permission;
