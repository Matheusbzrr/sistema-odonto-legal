const caseRepository = require("../repositories/caseRepository");
const notificationService = require("./notificationService");
const patientService = require("./patientService");
const { v4: uuidv4 } = require("uuid");
// cria novo caso
const createCase = async (data, userId) => {
  const patients = await Promise.all(
    data.nic.map(async (nic) => {
      const patient = await patientService.getPatientByNic(nic);
      if (!patient) {
        throw {
          status: 404,
          message: `Paciente com NIC ${nic} não encontrado!`,
        };
      }
      return { nic, _id: patient._id };
    })
  );

  for (const { nic, _id } of patients) {
    const cases = await caseRepository.getCasesByPatients(_id);
    if (cases && cases.length > 0) {
      throw {
        status: 409,
        message: `Paciente com ID ${nic} já possui um caso registrado.`,
      };
    }
  }

  const protocol = uuidv4().split("-")[0];

  const patientIds = patients.map((p) => p._id);

  const caseCreated = await caseRepository.createCase(
    data,
    userId,
    patientIds,
    protocol
  ); // passa o id do usuario parao repositorio

  for (const { nic } of patients) {
    await patientService.updatePatient(nic, {
      $push: { idCase: caseCreated._id },
    });
  }

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

// busca caso por protocol
const getCaseByProtocol = async (protocol) => {
  const foundCase = await caseRepository.getCaseByProtocol(protocol);
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

const getCasesByDate = async (date) => {
  const filterDate = await caseRepository.getCaseByDate(date);
  if (!filterDate) {
    throw { status: 404, message: "Nenhum caso encontrado nessa data!" };
  }


  return filterDate;
};

// atualiza status do caso
const updateCaseStatus = async (userId, protocol, updateData) => {
  const data = await caseRepository.getCaseByProtocol(protocol);
  if (!data) {
    throw { status: 404, message: "Caso não encontrado!" };
  }

  return await caseRepository.updateCaseStatus(userId, protocol, updateData);
};

const updateCaseData = async (data, userId, protocol) => {
  const oldCase = await caseRepository.getCaseByProtocol(protocol);
  if (!oldCase) {
    throw { status: 404, message: "Caso não encontrado!" };
  }

  if (oldCase.status === "FINALIZADO" || oldCase.status === "ARQUIVADO") {
    throw {
      status: 403,
      message:
        "Não é possível alterar dados de um caso finalizado ou arquivado! Solicite uma reabertura para realizar modificações.",
    };
  }

  let novosEnvolvidos = [];

  if (data.involved && Array.isArray(data.involved)) {
    // Encontrar usuários que já estão no caso
    const duplicados = data.involved.filter((user) =>
      oldCase.involved.includes(user)
    );

    if (duplicados.length > 0) {
      throw {
        status: 409,
        message: `Os seguintes usuários já estão no caso: ${duplicados.join(
          ", "
        )}.`,
      };
    }

    // Identificar apenas os novos envolvidos
    novosEnvolvidos = data.involved.filter(
      (user) => !oldCase.involved.includes(user)
    );
  }

  // Atualizar o caso no banco de dados
  const updatedCase = await caseRepository.updateCaseData(
    data,
    userId,
    protocol
  );

  // Enviar notificações apenas para os novos envolvidos
  if (novosEnvolvidos.length > 0) {
    for (const newUser of novosEnvolvidos) {
      const message = `Você foi incluído no caso ${updatedCase.nic}.`;
      await notificationService.notifyUser(newUser, updatedCase._id, message);
    }
  }

  return updatedCase;
};

module.exports = {
  createCase,
  getAllCases,
  casesByUser,
  casesByCpfUser,
  getCaseByProtocol,
  getCasesByStatus,
  getCasesByDate,
  updateCaseStatus,
  updateCaseData,
};
