const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    taskNo: {
      type: String,
      required: true,
      uppercase: true,
      unique: [true, "Task no is already registered"],
    },
    taskName: {
      type: String,
      required: true,
    },
    taskDescription: {
      type: String,
    },
    hours: {
      type: Number,
      required: true,
    },
    assignUser: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    status: {
      type: String, // to do, approved, inprogress, in review, qa testing, complate
      default: "to do",
    },
    taskPriority: {
      type: String, // Urgent, High, Normal, Low
      required: true,
    },
    perHourCharge: {
      type: Number,
      required: true,
    },
  },

  { timestamps: true, versionKey: false }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
