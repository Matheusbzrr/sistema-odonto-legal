const patienteService = require("../services/patientService");
const patienteDTO = require("../dtos/patienteDTO");
const { z } = require("zod");

const createPatient = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Verifique os dados informados!" });
  }
  const patient = req.body;

  try {
    const validated = patienteDTO.createPatientSchema.parse(patient);
    await patienteService.createPatient(validated);
    return res.status(201).json("Paciente criado com sucesso!");
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

const getAllPatients = async (req, res) => {
  const page = req.query.page - 1;
  if (page < 0) {
    return res.status(400).json({ message: "Página inválida!" });
  }
  try {
    const patients = await patienteService.getAllPatients(page);
    const validate = patienteDTO.patienteList.parse(patients);
    return res.json(validate);
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

const getPatient = async (req, res) => {
  if (!req.query.nic) {
    return res.status(404).json({ message: "Paciente não encontrado" });
  }

  try {
    const patient = await patienteService.getPatientByNic(req.query.nic);
    const validate = patienteDTO.responsePatienteDTO.parse(patient);
    return res.json(validate);
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

const updatePatient = async (req, res) => {
  if (!req.query.nic) {
    return res.status(404).json({ message: "Paciente não informado" });
  }
  if (!req.body) {
    return res.status(404).json({ message: "Dados não informados" });
  }
  try {
    const validated = patienteDTO.updatePatientSchema.parse(req.body);
    await patienteService.updatePatient(req.query.nic, validated);
    return res.status(200).json("Paciente atualizado com sucesso!");
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
  createPatient,
  getAllPatients,
  getPatient,
  updatePatient,
};
