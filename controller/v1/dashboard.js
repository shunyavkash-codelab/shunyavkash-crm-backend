const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Manager = require("../../model/manager");

// get dashbord data like (total manager, total clients, total project, total invoice)
exports.dashbord = asyncHandler(async (req, res, next) => {
  try {
    const dashboard = await Manager.aggregate([
      {
        $lookup: {
          from: "clients",
          pipeline: [
            {
              $facet: {
                clientCount: [
                  {
                    $count: "count",
                  },
                ],
              },
            },
            {
              $unwind: "$clientCount",
            },
            {
              $replaceRoot: {
                newRoot: "$clientCount",
              },
            },
          ],
          as: "clients",
        },
      },
      {
        $lookup: {
          from: "projects",
          pipeline: [
            {
              $facet: {
                projectCount: [
                  {
                    $count: "count",
                  },
                ],
              },
            },
            {
              $unwind: "$projectCount",
            },
          ],
          as: "projects",
        },
      },
      {
        $facet: {
          totalClient: [
            {
              $project: {
                total_client: {
                  $first: "$clients.count",
                },
              },
            },
          ],
          totalProject: [
            {
              $project: {
                total_project: {
                  $first: "$project.count",
                },
              },
            },
          ],
          totalManager: [
            {
              $group: {
                _id: "",
                count: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalClient: {
            $cond: [
              {
                $first: "$totalClient.total_client",
              },
              {
                $first: "$totalClient.total_client",
              },
              0,
            ],
          },
          totalProject: {
            $cond: [
              {
                $first: "$totalProject.total_project",
              },
              {
                $first: "$totalProject.total_project",
              },
              0,
            ],
          },
          totalManager: {
            $first: "$totalManager.count",
          },
        },
      },
    ]);
    return Comman.setResponse(res, 200, true, "Dashbord detile", dashboard[0]);
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
