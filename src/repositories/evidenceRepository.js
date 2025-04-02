const Evidence = require("../models/evidenceModel");

const createEvidence = async (userId, data, idCase) => {
  const evidence = new Evidence({ ...data, collector: userId, idCase });
  return await evidence.save();
};

const getAllEvidencesInCase = async (offset, limit, idCase) => {
  return await Evidence.find({ idCase })
    .skip(offset)
    .limit(limit)
    .populate("collector", " name role cpf");
};

const getEvidenceById = async (id) => {
  return await Evidence.findById(id).populate("collector", " name role cpf");
};

const updateEvidence = async (id, newData) => {
  return await Evidence.findByIdAndUpdate(id, newData, { new: true });
};

module.exports = {
  createEvidence,
  getAllEvidencesInCase,
  getEvidenceById,
  updateEvidence,
};
