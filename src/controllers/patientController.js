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

module.exports = {
  createPatient,
};
