const Case = require("../models/caseModel");

//cria um novo caso
const createCase = async (data) => {
    const newCase = new Case(data);
    return await newCase.save();
};

//busca pelo id 
const getCaseById = async (id) => {
    return await Case.findById(id); // aqui eu to passando o parametro pelo id, porque fica mais facil de entender, ao inves de data
};

//lista todos os casos com paginação
const getAllCases = async (offSet, limit) => {
    return await Case.find()
    .skip(offSet)
    .limit(limit);
};

//lista casos por status andamento...finalizado...
const getCasesByStatus = async (status, offSet, limit) => {
    return await Case.find()
    .where("status")
    .equals(status)
    .skip(offSet)
    .limit(limit);
};

const getCaseByNic = async (nic) => {
    return await Case.findOne({ nic });
  };

//atualiza o status de um caso e define a data de fechamento se for finalizado
const updateCaseStatus = async (id, newStatus, closedAt = null) => {
    const updateData = { status: newStatus};
    if (closedAt) {
        updateData.closedAt = closedAt;
    }
    return await Case.findByIdAndUpdate(id, updateData, {new: true});
};

module.exports = {
    createCase,
    getCaseById,
    getAllCases,
    getCasesByStatus,
    updateCaseStatus,
    getCaseByNic,
  };