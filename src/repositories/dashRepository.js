const CaseReport = require("../models/caseReport");
const Case = require("../models/caseModel");
const ReportEvidence = require("../models/reportEvidenceModel");
const Evidence = require("../models/evidenceModel");
const Patient = require("../models/patientModel");

const getCasesAndDistrict = async () => {
  return Case.aggregate([
    {
      $group: {
        _id: "$location.district",
        casos: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        bairro: "$_id",
        casos: 1,
      },
    },
    
  ]);
};
module.exports = { getCasesAndDistrict };