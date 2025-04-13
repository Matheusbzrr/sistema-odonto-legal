const reportEvidenceService = require("../services/reportEvidenceService");

const createReport = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Verifique os dados informados!" });
  }

  if (!req.query.evidence) {
    return res.status(400).json({ message: "Informe a evidencia do caso!" });
  }

  try {
    const data = {
    evidence: req.query.evidence,
    responsible: req.userId,
      ...req.body,
    };
    await reportEvidenceService.createReport(data);
    return res.status(201).json("Laudo de evidencia gerado com sucesso!");
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReport,
};
