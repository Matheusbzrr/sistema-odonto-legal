const CaseReport = require("../models/caseReport");

const createReport = async (data) => {
    const report = new CaseReport(data);
  return await report.save();
}

const getReport = async (id) => {
  return await CaseReport.findById(id).populate("evidence");
};

module.exports = {
  createReport,
  getReport,
};
