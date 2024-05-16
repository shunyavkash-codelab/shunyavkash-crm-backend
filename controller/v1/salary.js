const { default: mongoose } = require("mongoose");
const moment = require("moment");
const asyncHandler = require("../../middleware/async");
const Comman = require("../../middleware/comman");
const Pagination = require("../../middleware/pagination");
const Salary = require("../../model/salary");
const { generatePDF } = require("../../middleware/salarySlipPDF");
const User = require("../../model/user");
const Bank = require("../../model/bank");
const Leave = require("../../model/leave");
const numberToWords = require("number-to-words");
var Model = Salary;

// create salary
exports.add = asyncHandler(async (req, res, next) => {
  try {
    req.body.userId = req.user._id;
    let employee = await User.findById(req.body.employee);
    let empBank = await Bank.findOne({ userId: req.body.employee });
    let empLeave = await Leave.find({
      userId: req.body.employee,
      status: "approve",
      $or: [
        {
          startDate: {
            $gte: moment().subtract(1, "months").startOf("month").format(),
            $lte: moment().subtract(1, "months").endOf("month").format(),
          },
        },
        {
          endDate: {
            $gte: moment().subtract(1, "months").startOf("month").format(),
            $lte: moment().subtract(1, "months").endOf("month").format(),
          },
        },
      ],
    });
    const leaveDayCount = (item) => {
      let days = 0;
      if (item.startDate && item?.endDate) {
        let startDate = moment(item.startDate).format("YYYY-MM-DD");
        let endDate = moment(item.endDate).format("YYYY-MM-DD");
        days = moment(endDate).diff(startDate, "day") + 1;
        let futMonthLeave =
          moment(moment(startDate).endOf("month")).diff(startDate, "day") + 1;
        let pastMonthLeave =
          moment(endDate).diff(moment(endDate).startOf("month"), "day") + 1;
        if (days > futMonthLeave) {
          days = days - futMonthLeave;
        }
        if (days > pastMonthLeave) {
          days = pastMonthLeave;
        }
      } else {
        days = days + 1;
      }
      if (item.startDayType && item.startDayType !== "full day") {
        days = days - 0.5;
      }
      if (item.endDayType && item.endDayType !== "full day") {
        days = days - 0.5;
      }
      return days;
    };
    let paidLeaveDays = 0;
    let unpaidLeaveDays = 0;
    for (var item of empLeave) {
      if (item.leaveType !== "unpaid") {
        paidLeaveDays = paidLeaveDays + leaveDayCount(item);
      } else {
        unpaidLeaveDays = unpaidLeaveDays + leaveDayCount(item);
      }
    }
    let dynamicData = {
      payDate: moment(req.body.date).format("DD/MM/YYYY"),
      month: moment()
        .subtract(1, "months")
        .endOf("month")
        .format("MMMM - YYYY"),
      employeeName: employee.name,
      ctc: employee.ctc?.toLocaleString() || "N/A",
      employeeCode: employee.employeeId || "N/A",
      designation: employee.designation || "Employee",
      presentDay: 22 - paidLeaveDays - unpaidLeaveDays || "22",
      unpaidLeaveDays: unpaidLeaveDays,
      ifsc: empBank.IFSC,
      bankAccNum: empBank.accountNumber,
      bankName: empBank.bankName,
      eligibleDay: 22 - unpaidLeaveDays || "22",
      paidLeave: paidLeaveDays,
      basicSalary: req.body.amount,
      specialAllowance: req.body.incentive || "0",
      hra: "0",
      pf: "0",
      professionalTax: "0",
      tds: "0",
      incomeTotal: (
        Number(req.body.amount) + Number(req.body.incentive)
      ).toLocaleString(),
      deductionTotal: "0",
      netSalary: (
        Number(req.body.amount) + Number(req.body.incentive)
      ).toLocaleString(),
      netSalary1: (
        Number(req.body.amount) + Number(req.body.incentive)
      ).toLocaleString(),
      netSalaryInWord: numberToWords
        .toWords(Number(req.body.amount) + Number(req.body.incentive))
        .replace(",", ""),
    };
    generatePDF(dynamicData).then(async (pdfUrl) => {
      req.body.pdf = pdfUrl;
      let salary;
      if (req.body._id) {
        salary = await Model.findByIdAndUpdate(req.body._id, req.body, {
          new: true,
        });
      } else {
        salary = await Model.create(req.body);
      }
      const notiObj = {
        sender: req.user._id,
        receiver: salary.employee,
        text: ` month salary generated.`,
        itemId: salary._id,
        type: "salary",
      };
      await Comman.createNotification(notiObj);
      return Comman.setResponse(
        res,
        201,
        true,
        "Salary added successfully",
        salary
      );
    });
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

// Get salary
exports.getSalaryList = asyncHandler(async (req, res, next) => {
  try {
    let obj = { isDeleted: false };
    if (req.params.id) {
      obj.employee = new mongoose.Types.ObjectId(req.params.id);
    }
    let search = {};
    if (req.query.search) {
      search = { employee: { $regex: req.query.search, $options: "i" } };
    }
    if (req.query.from && req.query.to) {
      obj.date = {
        $gte: new Date(req.query.from + "T18:30:00.000Z"),
        $lte: new Date(req.query.to + "T18:29:59.999Z"),
      };
    }
    const aggregate = [
      {
        $match: obj,
      },
      {
        $lookup: {
          from: "users",
          localField: "employee",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "employee",
        },
      },
      {
        $addFields: {
          employee: {
            $first: "$employee.name",
          },
        },
      },
      {
        $match: search,
      },
    ];
    const result = await Pagination(req, res, Model, aggregate);
    return Comman.setResponse(
      res,
      200,
      true,
      "Salary get successfully.",
      result
    );
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

// delete salary
exports.deleteSalary = asyncHandler(async (req, res, next) => {
  try {
    await Model.updateOne(
      { _id: req.params.id },
      { isDeleted: true },
      { new: true }
    );
    return Comman.setResponse(res, 200, true, "Delete salary successfully.");
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
