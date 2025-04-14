const caseReportService = require("../services/caseReportService");

const createReport = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Verifique os dados informados!" });
  }

  if (!req.query.case) {
    return res.status(400).json({ message: "Informe a evidencia do caso!" });
  }

  try {
    const data = {
    case: req.query.case,
    responsible: req.userId,
      ...req.body,
    };
    await caseReportService.createReport(data);
    return res.status(201).json("Relatorio gerado com sucesso!");
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
