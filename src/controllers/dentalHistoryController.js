const dentalHistoryService = require("../services/dentalHistoryService");
const dentalHistoryDTO = require("../dtos/dentalHistoryDTO");
const { z } = require("zod");

const createExame = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Verifique os dados informados!" });
  }

  const dentalHistory = req.body;
  try {
    const validated =
      dentalHistoryDTO.createDentalHistorySchema.parse(dentalHistory);
    await dentalHistoryService.createDentalHistory(validated, req.userId);
    return res.status(201).json("Histórico dental criado com sucesso!");
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

const getAllExams = async (req, res) => {
  const page = req.params.page - 1;
  if (page < 0) {
    return res.status(400).json({ message: "Página inválida!" });
  }

  if (!req.body.nic) {
    return res
      .status(400)
      .json({ message: "É necessário informar NIC do paciente." });
  }

  try {
    const dentalHistories = await dentalHistoryService.getAllDentalHistories(
      page,
      req.body.nic
    );
    const validatedResponse =
      dentalHistoryDTO.listResponse.parse(dentalHistories);
    return res.status(200).json(validatedResponse);
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
  createExame,
  getAllExams,
};
