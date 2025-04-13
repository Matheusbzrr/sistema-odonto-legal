const ReportEvidence = require("../models/reportEvidenceModel");

const createReport = async (data) => {
  const report = new ReportEvidence(data);
  return await report.save();
};

const getReport = async (id) => {
  return await ReportEvidence.findById(id).populate("evidence");
};

module.exports = {
  createReport,
  getReport,
};
