const patientService = require("../services/patientService");
const dentalHistoryRepository = require("../repositories/dentalHistory");
const { v4: uuidv4 } = require("uuid");

const createDentalHistory = async (data, userId) => {
  const patient = await patientService.getPatientByNic(data.nic);
  if (!patient) {
    throw { status: 404, message: "Paciente não encontrado" };
  }

  const protocolDental = uuidv4();

  const dentalHistory = await dentalHistoryRepository.createDentalHistory(
    data,
    userId,
    patient._id,
    protocolDental
  );

  await patientService.updatePatient(data.nic, {
    $push: { dentalHistory: dentalHistory._id },
  });
  return { msg: "Paciente cadastrado" };
};

const getAllDentalHistories = async (page, nic) => {
  const limit = 10;
  const offset = page * limit;
  const patient = await patientService.getPatientByNic(nic);
  if (!patient) {
    throw { status: 404, message: "Paciente não encontrado" };
  }

  const dentalHistories =
    await dentalHistoryRepository.getAllDentalHistoriesByPatient(patient._id, offset, limit);
  return dentalHistories;
};

module.exports = { createDentalHistory, getAllDentalHistories };
