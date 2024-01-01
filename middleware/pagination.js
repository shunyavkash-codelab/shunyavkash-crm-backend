async function Pagination(req, res, model, aggregationSchema) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const column_name = req.query?.sortField || "createdAt";
  const OrderBy = req.query?.orderBy == "ASC" ? 1 : -1;
  const sortData = { [column_name]: OrderBy };

  const skip = (page - 1) * limit;

  const facetStage = [
    {
      $facet: {
        paginatedData: [
          { $sort: sortData },
          { $skip: skip },
          { $limit: limit },
        ],
        totalDocs: [{ $count: "count" }],
      },
    },
    { $addFields: { totalDocs: { $arrayElemAt: ["$totalDocs.count", 0] } } },
  ];

  const modifiedAggregation = [...aggregationSchema, ...facetStage];

  try {
    const aggregationResult = await model.aggregate(modifiedAggregation);

    const records = aggregationResult[0].totalDocs;
    const pages = Math.ceil(records / limit);
    const hasNextPage = page < pages;
    const hasPreviousPage = page > 1;

    const paginationInfo = {
      pagination: {
        records: records ? records : 0,
        pages: records ? pages : 1,
        current: page,
        limit,
        next: hasNextPage === false ? undefined : { next: page + 1, limit },
        hasNextPage,
        hasPreviousPage,
      },
      data: aggregationResult[0].paginatedData,
    };

    return paginationInfo;
  } catch (error) {
    console.log(error);
  }
}

module.exports = Pagination;
