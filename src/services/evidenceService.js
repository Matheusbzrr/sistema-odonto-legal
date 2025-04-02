const evidenceRepository = require("../repositories/evidenceRepository");
const casesRepository = require("../repositories/caseRepository");

const createEvidence = async (userId, data, nic) => {
  const caseExists = await casesRepository.getCaseByNic(nic);
  if (!caseExists) {
    throw { status: 404, message: "Caso não encontrado!" };
  }

  if (caseExists.status === "FINALIZADO" || caseExists.status === "ARQUIVADO") {
    throw {
      status: 403,
      message:
        "Caso indisponivel para anexar novas evidencias. Por favor solicite a reabertura do caso para prosseguir.",
    };
  }

  return await evidenceRepository.createEvidence(userId, data, caseExists._id);
};

const getAllEvidencesInCase = async (page, nic) => {
  const limit = 10;
  const offset = page * limit;

  const caseExists = await casesRepository.getCaseByNic(nic);
  if (!caseExists) {
    throw { status: 404, message: "Caso não encontrado!" };
  }

  const evidencesList = await evidenceRepository.getAllEvidencesInCase(offset, limit,
    caseExists._id
  );

  if (evidencesList.length === 0) {
    throw { status: 404, message: "Nenhuma evidência encontrada nesse caso!" };
  }
  return evidencesList;
};

const getEvidenceById = async (evidenceId) => {
  const evidence = await evidenceRepository.getEvidenceById(evidenceId);
  if (!evidence) {
    throw { status: 404, message: "Evidência não encontrada!" };
  }
  return evidence;
};

module.exports = {
  createEvidence,
  getAllEvidencesInCase,
  getEvidenceById,
};
