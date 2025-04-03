const DentalHistory = require("../models/dentalHistory");

const createDentalHistory = async (data, userId, idPatient, protocolDental) => {
  const dentalHistory = new DentalHistory({
    ...data,
    idPatient,
    examiner: userId,
    protocolDental,
  });
  return await dentalHistory.save();
};

const getAllDentalHistoriesByPatient = async (idPatient, offset, limit) => {
  return await DentalHistory.find({ idPatient })
    .skip(offset)
    .limit(limit)
    .populate("examiner", "name role")
    .sort({ createdAt: -1 });
};

const updateDentalHistory = async (id, data) => {
  return await DentalHistory.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
  createDentalHistory,
  getAllDentalHistoriesByPatient,
  updateDentalHistory,
};
