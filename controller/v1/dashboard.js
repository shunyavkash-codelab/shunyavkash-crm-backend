const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Client = require("../../model/client");
const Invoice = require("../../model/invoice");
const User = require("../../model/user");
const Project = require("../../model/project");

// get dashbord data like (total user, total clients, total project, total invoice)
exports.dashboard = asyncHandler(async (req, res, next) => {
  try {
    let totalEmployee = await User.find({
      role: { $ne: 0 },
      isDeleted: false,
    }).count();
    let totalProject = await Project.find().count();
    let totalClient = await Client.find().count();
    let totalInvoice = await Invoice.find().count();
    let dashboard = {
      totalEmployee: totalEmployee,
      totalProject: totalProject,
      totalClient: totalClient,
      totalInvoice: totalInvoice,
    };
    return Comman.setResponse(res, 200, true, "Dashboard details", dashboard);
  } catch (error) {
    console.log(error);
    return Comman.setResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
});
