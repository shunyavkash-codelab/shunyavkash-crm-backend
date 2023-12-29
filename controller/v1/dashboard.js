const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Client = require("../../model/client");
const Invoice = require("../../model/invoice");
const Manager = require("../../model/manager");
const Project = require("../../model/project");

// get dashbord data like (total manager, total clients, total project, total invoice)
exports.dashboard = asyncHandler(async (req, res, next) => {
  try {
    // const dashboard = await Manager.aggregate([
    //   {
    //     $lookup: {
    //       from: "clients",
    //       pipeline: [
    //         {
    //           $facet: {
    //             clientCount: [
    //               {
    //                 $count: "count",
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           $unwind: "$clientCount",
    //         },
    //         {
    //           $replaceRoot: {
    //             newRoot: "$clientCount",
    //           },
    //         },
    //       ],
    //       as: "clients",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "projects",
    //       pipeline: [
    //         {
    //           $facet: {
    //             projectCount: [
    //               {
    //                 $count: "count",
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           $unwind: "$projectCount",
    //         },
    //       ],
    //       as: "projects",
    //     },
    //   },
    //   {
    //     $facet: {
    //       totalClient: [
    //         {
    //           $project: {
    //             total_client: {
    //               $first: "$clients.count",
    //             },
    //           },
    //         },
    //       ],
    //       totalProject: [
    //         {
    //           $project: {
    //             total_project: {
    //               $first: "$projects.projectCount.count",
    //             },
    //           },
    //         },
    //       ],
    //       totalManager: [
    //         {
    //           $group: {
    //             _id: "",
    //             count: {
    //               $sum: 1,
    //             },
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $project: {
    //       totalClient: {
    //         $cond: [
    //           {
    //             $first: "$totalClient.total_client",
    //           },
    //           {
    //             $first: "$totalClient.total_client",
    //           },
    //           0,
    //         ],
    //       },
    //       totalProject: {
    //         $cond: [
    //           {
    //             $first: "$totalProject.total_project",
    //           },
    //           {
    //             $first: "$totalProject.total_project",
    //           },
    //           0,
    //         ],
    //       },
    //       totalManager: {
    //         $first: "$totalManager.count",
    //       },
    //     },
    //   },
    // ]);
    let totalManager = await Manager.find().count();
    let totalProject = await Project.find().count();
    let totalClient = await Client.find().count();
    let totalInvoice = await Invoice.find().count();
    let dashboard = {
      totalManager: totalManager,
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
