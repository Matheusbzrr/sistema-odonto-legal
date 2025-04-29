const evidenceService = require("../services/evidenceService");
const evidenceDTO = require("../dtos/evidenceDTO");
const { z } = require("zod");

const createEvidence = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Verifique os dados informados!" });
  }

  if (!req.query.protocol) {
    return res.status(400).json({ message: "Informe o protocolo do caso!" });
  }

  try {
    const validated = evidenceDTO.createEvidenceDTO.parse(req.body);
    await evidenceService.createEvidence(req.userId, req.userRole, validated, req.query.protocol);
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

// avaliar excluir
const getEvidenceById = async (req, res) => {
  const evidenceId = req.query.evidenceId;
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

const updateEvidence = async (req, res) => {
  const evidenceId = req.query.evidenceId;
  if (!evidenceId) {
    return res
      .status(400)
      .json({ message: "É necessário informar ID da evidência." });
  }
  if (!req.body) {
    return res.status(400).json({ message: "Verifique os dados informados!" });
  }
  try {
    const validated = evidenceDTO.updateEvidenceDTO.parse(req.body);
    await evidenceService.updateEvidence(evidenceId, validated);
    return res.status(200).json("Evidência atualizada com sucesso!");
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
  getEvidenceById,
  updateEvidence,
};
