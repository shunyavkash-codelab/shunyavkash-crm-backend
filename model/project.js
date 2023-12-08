const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    employeeId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Employee",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
      required: true,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    perHourCharge: {
      type: Number,
      required: true,
    },
    currency: {
      type: String, // eour,dollar etc
      required: true,
    },
    payPeriod: {
      type: String, //Weekly, 2 Weeks, 4 Weeks, Monthly
    },
    prefix: {
      type: String, // EX. SHU
      unique: true,
      required: true,
    },
    status: {
      type: String, // initial, inProgress, completed
      default: "initial",
    },
  },

  { timestamps: true, versionKey: false }
);

projectSchema.index({ prefix: 1 }, { unique: true });
const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
