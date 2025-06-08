const llm = require("../services/llmService");
const evidence = require("../services/evidenceService");
const caseService = require("../services/caseService");

const generateResponseEvidence = async (req, res) => {
  if (!req.query.evidence) {
    return res.status(400).json({ message: "Informe a evidencia do caso!" });
  }
  try {
    const evidenceId = req.query.evidence;
    console.log(evidenceId);
    const evidenceData = await evidence.getEvidenceById(evidenceId);
    const response = await llm.getLLMResponseLaudo(evidenceData);
    return res.status(200).json(response);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const generateResponseCase = async (req, res) => {
  if (!req.query.case) {
    return res.status(400).json({ message: "Informe a evidencia do caso!" });
  }
  try {
    const caseProtocol = req.query.case;
    console.log(caseProtocol);
    const caseData = await caseService.getCaseByProtocol(caseProtocol);
    const response = await llm.getLLMResponseCase(caseData);
    return res.status(200).json(response);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateResponseEvidence,
  generateResponseCase,
};
