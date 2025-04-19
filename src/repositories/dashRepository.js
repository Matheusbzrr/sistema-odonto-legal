const Case = require("../models/caseModel");
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

const getCasesAndDate = async () => {
  return Case.aggregate([
    // extrai só o mês de createdAt (1 = Janeiro, …, 12 = Dezembro)
    {
      $group: {
        _id: { $month: "$createdAt" },
        casos: { $sum: 1 },
      },
    },
    // projeta { month: 1–12, count }
    {
      $project: {
        _id: 0,
        mes: "$_id",
        casos: 1,
      },
    },
    // ordena de Jan (1) até Dez (12)
    { $sort: { month: 1 } },
  ]);
};

const getCasesByStatus = async () => {
  return Case.aggregate([
    { $group: { _id: "$status", casos: { $sum: 1 } } },
    { $project: { _id: 0, status: "$_id", casos: 1 } },
  ]);
};

const getVitimsByStatusOfIdentification = async () => {
  return Patient.aggregate([
    { $group: { _id: "$identificationStatus", vitimas: { $sum: 1 } } },
    { $project: { _id: 0, status: "$_id", vitimas: 1 } },
  ]);
}

module.exports = { getCasesAndDistrict, getCasesAndDate, getCasesByStatus, getVitimsByStatusOfIdentification };
