const caseReportRepository = require("../repositories/caseReportRepository");
const caseRepository = require("../repositories/caseRepository");

const createReport = async (data) => {
  const reportExisting = await caseRepository.getCaseById(data.case);
  if (reportExisting.caseReport) {
    throw {
      status: 409,
      message: "Laudo ja existente",
    };
  }
  const report = await caseReportRepository.createReport(data);
  return report;
};

module.exports = {
  createReport,
};
