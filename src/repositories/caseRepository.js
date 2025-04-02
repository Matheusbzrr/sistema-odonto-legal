const Case = require("../models/caseModel");

//cria um novo caso
const createCase = async (data, userId) => {
  const newCase = new Case({ ...data, openedBy: userId });
  return await newCase.save();
};

//lista todos os casos com paginação
const getAllCases = async (offSet, limit) => {
  return await Case.find()
    .skip(offSet)
    .limit(limit)
    .populate("openedBy", "name role cpf")
    .populate("involved", "name role cpf")
    .populate(
      "evidence",
      "title descriptionTechnical condition obs collector category"
    );
};

// lista todos os casos onde usuarios criou e esta envolvido
const getCasesByInUser = async (offSet, limit, userId) => {
  const cases = await Case.find({
    $or: [
      { openedBy: userId }, // O 'userId' pode estar no campo 'openedBy'
      { involved: userId }, // Ou pode estar no campo 'involved'
    ],
  })
    .skip(offSet)
    .limit(limit)
    .populate("openedBy", "name role cpf")
    .populate("involved", "name role cpf")
    .populate({
      path: "evidence",
      select: "title descriptionTechnical condition obs collector category",
      populate: {
        path: "collector",
        select: "name role cpf",
      },
    });

  return cases;
};

// busca todos os casos de um usuario passando o cpf dele
const getCasesByCpfUser = async (offSet, limit, cpf) => {
  const cases = await Case.find()
    .populate("openedBy", "name role cpf")
    .populate({
      path: "involved",
      select: "name role cpf",
      match: { cpf },
    })
    .skip(offSet)
    .limit(limit)
    .populate(
      "evidence",
      "title descriptionTechnical condition obs collector category"
    );
  return cases.filter((c) => c.openedBy?.cpf === cpf || c.involved.length > 0);
};

//lista casos por status andamento...finalizado...
const getCasesByStatus = async (status, offSet, limit) => {
  return await Case.find()
    .where("status")
    .equals(status)
    .skip(offSet)
    .limit(limit)
    .populate("openedBy", "name role cpf")
    .populate("involved", "name role cpf")
    .populate(
      "evidence",
      "title descriptionTechnical condition obs collector category"
    );
};

// busca pelo nic e detalha as evidencias
const getCaseByNic = async (nic) => {
  return await Case.findOne({ nic })
    .populate("openedBy", "name role cpf")
    .populate("involved", "name role cpf")
    .populate("evidence");
};

//atualiza o status de um caso e define a data de fechamento se for finalizado
const updateCaseStatus = async (userId, nic, newStatus) => {
  if (newStatus === "FINALIZADO") {
    const closedAt = new Date();
    return await Case.findOneAndUpdate(
      { nic },
      { status: newStatus, closedAt, userId },
      { new: true, userId }
    );
  }
  if (newStatus === "EM ABERTO") {
    return await Case.findOneAndUpdate(
      { nic },
      {
        status: newStatus,
        closedAt: null,
        userId,
      },
      { new: true }
    );
  }

  const closedAt = new Date();
  return await Case.findOneAndUpdate(
    { nic },
    { status: newStatus, closedAt, userId },
    { new: true }
  );
};

const updateCaseData = async (data, userId, nic) => {
  return await Case.findOneAndUpdate(
    { nic },
    { $set: data, userId },
    { new: true }
  );
};

module.exports = {
  createCase,
  getAllCases,
  getCasesByInUser,
  getCasesByCpfUser,
  getCasesByStatus,
  getCaseByNic,
  updateCaseStatus,
  updateCaseData,
};
