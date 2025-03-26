const caseRepository = require("../repositories/caseRepository");
const {
  caseCreateDTO,
  caseResponseDTO,
  caseListDTO,
  caseUpdateStatusDTO,
} = require("../dtos/caseDTO");

// cria novo caso
const createCase = async (data) => {
  const validatedData = caseCreateDTO.safeParse(data);
  if (!validatedData.success) {
    const errorMessage = validatedData.error.errors[0].message;
    throw { status: 400, message: errorMessage };
  }

  // verifica se NIC já existe
  const existingCase = await caseRepository.getCaseByNic(data.nic);
  if (existingCase) {
    throw { status: 409, message: "NIC já cadastrado!" };
  }

  const savedCase = await caseRepository.createCase(data);
  return { message: "Caso criado com sucesso!", caseId: savedCase._id };
};

// busca caso por ID
const getCaseById = async (id) => {
  const foundCase = await caseRepository.getCaseById(id);
  if (!foundCase) {
    throw { status: 404, message: "Caso não encontrado!" };
  }

  const validated = caseResponseDTO.safeParse(foundCase);
  if (!validated.success) {
    throw { status: 500, message: "Erro ao validar dados do caso." };
  }

  return validated.data;
};

// lista todos os casos com paginação
const getAllCases = async (page) => {
  const limit = 10;
  const offset = page * limit;

  const cases = await caseRepository.getAllCases(offset, limit);
  if (!cases.length) {
    throw { status: 404, message: "Nenhum caso encontrado!" };
  }

  const validated = caseListDTO.safeParse(cases);
  if (!validated.success) {
    throw { status: 500, message: "Erro ao validar lista de casos." };
  }

  return validated.data;
};

// filtra casos por status com paginação
const getCasesByStatus = async (status, page) => {
  const limit = 10;
  const offset = page * limit;

  const cases = await caseRepository.getCasesByStatus(status, offset, limit);
  if (!cases.length) {
    throw { status: 404, message: "Nenhum caso com esse status!" };
  }

  const validated = caseListDTO.safeParse(cases);
  if (!validated.success) {
    throw { status: 500, message: "Erro ao validar lista de casos por status." };
  }

  return validated.data;
};

// atualiza status do caso
const updateCaseStatus = async (id, updateData) => {
  const validated = caseUpdateStatusDTO.safeParse(updateData);
  if (!validated.success) {
    const errorMessage = validated.error.errors[0].message;
    throw { status: 400, message: errorMessage };
  }

  const { status, closedAt } = validated.data;
  const updated = await caseRepository.updateCaseStatus(id, status, closedAt);

  if (!updated) {
    throw { status: 404, message: "Caso não encontrado para atualização!" };
  }

  return { message: "Status atualizado com sucesso!", caseId: updated._id };
};

module.exports = {
  createCase,
  getCaseById,
  getAllCases,
  getCasesByStatus,
  updateCaseStatus,
};
