const Case = require("../models/caseModel");

//cria um novo caso
const createCase = async (data, userId, patient, protocol) => {
  const newCase = new Case({ ...data, openedBy: userId, patient, protocol });
  return await newCase.save();
};

const getCasesByPatients = async (patients) => {
  return await Case.find({ patient: { $in: patients } });
};

//lista todos os casos com paginação
const getAllCases = async (offSet, limit) => {
  return await Case.find()
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
    })
    .sort({ createdAt: -1 });
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
    })
    .sort({ createdAt: -1 });

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
    .populate({
      path: "evidence",
      select: "title descriptionTechnical condition obs collector category",
      populate: {
        path: "collector",
        select: "name role cpf",
      },
    })
    .sort({ createdAt: -1 });
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
    .populate({
      path: "evidence",
      select: "title descriptionTechnical condition obs collector category",
      populate: {
        path: "collector",
        select: "name role cpf",
      },
    })
    .sort({ createdAt: -1 });
};

// busca pelo protocol e detalha as evidencias
const getCaseByProtocol = async (protocol) => {
  return await Case.findOne({ protocol })
    .populate("openedBy", "name role cpf")
    .populate("involved", "name role cpf")
    .populate({
      path: "evidence",
      populate: {
        path: "collector",
        select: "name role cpf",
      },
    });
};

//atualiza o status de um caso e define a data de fechamento se for finalizado
const updateCaseStatus = async (userId, protocol, newStatus) => {
  if (newStatus === "FINALIZADO") {
    const closedAt = new Date();
    return await Case.findOneAndUpdate(
      { protocol },
      { status: newStatus, closedAt, userId },
      { new: true, userId }
    );
  }
  if (newStatus === "EM ABERTO") {
    return await Case.findOneAndUpdate(
      { protocol },
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
    { protocol },
    { status: newStatus, closedAt, userId },
    { new: true }
  );
};

const updateCaseData = async (data, userId, protocol) => {
  return await Case.findOneAndUpdate(
    { protocol },
    { $set: data, userId },
    { new: true }
  );
};

module.exports = {
  createCase,
  getCasesByPatients,
  getAllCases,
  getCasesByInUser,
  getCasesByCpfUser,
  getCasesByStatus,
  getCaseByProtocol,
  updateCaseStatus,
  updateCaseData,
};
