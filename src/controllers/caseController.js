const caseService = require("../services/caseService");
const caseDTO = require("../dtos/caseDTO");
const { z } = require("zod");

// cria um novo caso
const createCase = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Verifique os dados informados!" });
  }

  try {
    const validatedData = caseDTO.caseCreateDTO.parse(req.body, req.role);
    const result = await caseService.createCase(validatedData);
    return res.status(201).json(result);
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

// busca caso por ID
const getCaseById = async (req, res) => {
  try {
    const result = await caseService.getCaseById(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// lista todos os casos com paginação
const getAllCases = async (req, res) => {
  const page = req.params.page - 1;
  if (page < 0) {
    return res.status(400).json({ message: "Página inválida!" });
  }

  try {
    const result = await caseService.getAllCases(page);
    return res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// lista casos por status com paginação
const getCasesByStatus = async (req, res) => {
  const page = req.params.page - 1;
  if (page < 0) {
    return res.status(400).json({ message: "Página inválida!" });
  }

  try {
    const result = await caseService.getCasesByStatus(
      req.params.status,
      page
    );
    return res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// atualiza o status de um caso
const updateStatusCaseById = async (req, res) => {
  if (!req.params.id || !req.body.status) {
    return res
      .status(400)
      .json({ message: "ID do caso e status são obrigatórios!" });
  }

  try {
    const result = await caseService.updateCaseStatus(
      req.params.id,
      req.body
    );
    return res.status(200).json(result);
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
  createCase,
  getCaseById,
  getAllCases,
  getCasesByStatus,
  updateStatusCaseById,
};
