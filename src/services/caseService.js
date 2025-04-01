const caseRepository = require("../repositories/caseRepository");

// cria novo caso
const createCase = async (data, userId) => {
  // verifica se NIC já existe
  const existingCase = await caseRepository.getCaseByNic(data.nic);
  if (existingCase) {
    throw { status: 409, message: "NIC já cadastrado!" };
  }

  const savedCase = await caseRepository.createCase(data, userId); // passa o id do usuario parao repositorio
  return { message: "Caso criado com sucesso!", caseId: savedCase._id }; // avaliar retornar a mensagem o NIC ao inves do Id do caso
};

// busca caso por ID
const getCaseByNic = async (nic) => {
  const foundCase = await caseRepository.getCaseByNic(nic);
  if (!foundCase) {
    throw { status: 404, message: "Caso não encontrado!" };
  }

  return foundCase;
};

// lista todos os casos com paginação
const getAllCases = async (page) => {
  const limit = 10;
  const offset = page * limit;

  const cases = await caseRepository.getAllCases(offset, limit);
  if (!cases.length) {
    throw { status: 404, message: "Nenhum caso encontrado!" };
  }

  return cases;
};

// filtra casos por status com paginação
const getCasesByStatus = async (status, page) => {
  const limit = 10;
  const offset = page * limit;

  const cases = await caseRepository.getCasesByStatus(status, offset, limit);
  if (!cases.length) {
    throw { status: 404, message: "Nenhum caso com esse status!" };
  }

  return cases;
};

// atualiza status do caso
const updateCaseStatus = async (nic, updateData) => {
  const data = await caseRepository.getCaseByNic(nic);
  if (!data) {
    throw { status: 404, message: "Caso não encontrado!" };
  }

  return await caseRepository.updateCaseStatus(nic, updateData);
};

module.exports = {
  createCase,
  getCaseByNic,
  getAllCases,
  getCasesByStatus,
  updateCaseStatus,
};
