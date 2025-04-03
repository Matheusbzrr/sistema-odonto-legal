const patientRepository = require("../repositories/patientRepository");

const createPatient = async (data) => {
  // verifica se CPF já existe
  const patientExists = await patientRepository.getPatientByCpf(data.cpf);
  if (patientExists) {
    throw { status: 409, message: `CPF já cadastrado! Pertence ao paciente ${patientExists.name} com nic: ${patientExists.nic} ` };
  }

  const patientExistsByNic = await patientRepository.getPatientByNic(data.nic);
  if (patientExistsByNic) {
    throw { status: 409, message: "NIC já cadastrado!" };
  }

  await patientRepository.createPatient(data);
  return { message: "Paciente criado com sucesso!" };
};

// lista todos os pacientes

const getAllPatients = async (page) => {
  const limit = 10;
  const offset = page * limit;
  const patients = await patientRepository.getAllPatients(offset, limit);
  return patients;
};

const getPatientByNic = async (nic) => {
  const patient = await patientRepository.getPatientByNic(nic);
  if (!patient) {
    throw { status: 404, message: "Paciente não encontrado!" };
  }
  return patient;
};

const updatePatient = async (nic, data) => {
  const patient = await patientRepository.getPatientByNic(nic);
  if (!patient) {
    throw { status: 404, message: "Paciente não encontrado!" };
  }
  await patientRepository.updatePatient(patient._id, data);
  return { message: "Paciente atualizado com sucesso!" };
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientByNic,
  updatePatient,
};
