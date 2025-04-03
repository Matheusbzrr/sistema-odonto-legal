const Patient = require("../models/patientModel");

const createPatient = async (data) => {
  const patient = new Patient(data);
  return await patient.save();
};

const getAllPatients = async (offset, limit) => {
  return await Patient.find()
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate({
      path: "dentalHistory",
      select:
        "examType toothCharting photo examiner injuryDetails createdAt updatedAt",
      populate: {
        path: "examiner",
        select: "name role",
      },
    });
};

const getPatientByNic = async (nic) => {
  return await Patient.findOne({ nic }).populate({
    path: "dentalHistory",
    select:
      "examType toothCharting photo examiner injuryDetails createdAt updatedAt",
    populate: {
      path: "examiner",
      select: "name role",
    },
  });
};

const getPatientByCpf = async (cpf) => {
  return await Patient.findOne({ cpf });
};

const updatePatient = async (id, data) => {
  return await Patient.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientByNic,
  getPatientByCpf,
  updatePatient,
};
