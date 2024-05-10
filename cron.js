const schedule = require("node-schedule");
const Invoice = require("./model/invoice");

const find24HrViewInvoice = async () => {
  try {
    let currDate = new Date();
    let futDate = new Date();
    futDate.setHours(futDate.getHours() + 24);
    const getInvoices = await Invoice.find({
      $and: [
        { invoiceDueDate: { $lte: Date(futDate + "T00:00:00.000Z") } },
        { invoiceDueDate: { $gte: Date(currDate + "T00:00:00.000Z") } },
      ],
      status: "pending",
    }).select("_id invoiceDueDate");
    for (const invoice of getInvoices) {
      const trend = invoice._id;
      schedule.scheduleJob(
        invoice.invoiceDueDate,
        async function () {
          await Invoice.findByIdAndUpdate(invoice._id, {
            $set: { status: "unpaid" },
          });
        }.bind(null, trend)
      );
    }
  } catch (error) {
    console.log(error);
  }
};

// every day 12AM
schedule.scheduleJob("0 0 0 * * *", async function () {
  find24HrViewInvoice();
});
find24HrViewInvoice();
