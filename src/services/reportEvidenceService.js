const reportEvidenceRepository = require("../repositories/evidenceReportRepository");
const evidenceRepository = require("../repositories/evidenceRepository");

const createReport = async (data) => {
  const reportExisting = await evidenceRepository.getEvidenceById(data.evidence);
  if (reportExisting.reportEvidence) {
    throw {
      status: 409,
      message: "Laudo ja existente",
    };
  }
  const report = await reportEvidenceRepository.createReport(data);
  return report;
};

module.exports = {
  createReport,
};
