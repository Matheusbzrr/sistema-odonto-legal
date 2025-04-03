const reportService = require("../services/reportService");

const getReport = async (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ message: "Informe o protocolo do caso para gerar o laudo!" });
  }

  try {
    const protocol = req.body.protocol;
    const report = await reportService.generateReport(protocol);
    return res.status(200).json(report);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors,
      });
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReport,
};
