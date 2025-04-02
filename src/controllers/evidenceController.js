const evidenceService = require("../services/evidenceService");
const evidenceDTO = require("../dtos/evidenceDTO");
const { z } = require("zod");

const createEvidence = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Verifique os dados informados!" });
  }

  if (!req.params) {
    return res.status(400).json({ message: "Informe o NIC do caso!" });
  }

  try {
    const validated = evidenceDTO.createEvidenceDTO.parse(req.body);
    await evidenceService.createEvidence(req.userId, validated, req.params.nic);
    return res.status(201).json("Evidencia adicionada no caso com sucesso!");
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

const getAllEvidencesInCase = async (req, res) => {
  const page = req.params.page - 1;
  if (page < 0) {
    return res.status(400).json({ message: "Página inválida!" });
  }
  const nic = req.body.nic;
  if (!nic || typeof nic !== "string") {
    return res
      .status(400)
      .json({ message: "É necessário informar corretamente NIC do caso." });
  }

  try {
    const result = await evidenceService.getAllEvidencesInCase(page, nic);
    const validated = evidenceDTO.listEvidenceResponseDTO.parse(result);
    return res.status(200).json(validated);
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

const getEvidenceById = async (req, res) => {
  const evidenceId = req.params.evidenceId;
  if (!evidenceId) {
    return res
      .status(400)
      .json({ message: "É necessário informar ID da evidência." });
  }

  try {
    const result = await evidenceService.getEvidenceById(evidenceId);
    const validated = evidenceDTO.responseEvidence.parse(result);
    return res.status(200).json(validated);
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
  createEvidence,
  getAllEvidencesInCase,
  getEvidenceById
};
