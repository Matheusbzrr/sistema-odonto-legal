const caseRepository = require("../repositories/caseRepository");

// cria novo caso
const createCase = async (data, userId) => {
  // verifica se NIC já existe
  const existingCase = await caseRepository.getCaseByNic(data.nic);
  if (existingCase) {
    throw { status: 409, message: "NIC já cadastrado!" };
  }

  await caseRepository.createCase(data, userId); // passa o id do usuario parao repositorio
  return { message: "Caso criado com sucesso!" };
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

// buscar casos onde usuario logado está envolvido
const casesByUser = async (page, user) => {
  const limit = 10;
  const offset = page * limit;
  const cases = await caseRepository.getCasesByInUser(offset, limit, user);
  if (!cases.length) {
    throw { status: 404, message: "Nenhum caso encontrado para esse usuário!" };
  }
  return cases;
};

const casesByCpfUser = async (page, cpf) => {
  const limit = 10;
  const offset = page * limit;
  const cases = await caseRepository.getCasesByCpfUser(offset, limit, cpf);
  if (!cases.length) {
    throw { status: 404, message: "Nenhum caso encontrado para esse CPF!" };
  }
  return cases;
};

// busca caso por NIC
const getCaseByNic = async (nic) => {
  const foundCase = await caseRepository.getCaseByNic(nic);
  if (!foundCase) {
    throw { status: 404, message: "Caso não encontrado!" };
  }

  return foundCase;
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
const updateCaseStatus = async (userId, nic, updateData) => {
  const data = await caseRepository.getCaseByNic(nic);
  if (!data) {
    throw { status: 404, message: "Caso não encontrado!" };
  }

  return await caseRepository.updateCaseStatus(userId, nic, updateData);
};

const updateCaseData = async (data, userId, nic) => {
  const oldCase = await caseRepository.getCaseByNic(nic);
  if (!oldCase) {
    throw { status: 404, message: "Caso não encontrado!" };
  }

  if(oldCase.status === "FINALIZADO" || oldCase.status === "ARQUIVADO"){
    throw { status: 403, message: "Não é possível alterar dados de um caso finalizado ou arquivado! Solicite uma reabertura para realizar modificações." };
  }

  return await caseRepository.updateCaseData(data, userId, nic);
};

module.exports = {
  createCase,
  getAllCases,
  casesByUser,
  casesByCpfUser,
  getCaseByNic,
  getCasesByStatus,
  updateCaseStatus,
  updateCaseData,
};
