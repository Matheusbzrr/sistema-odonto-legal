const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

const registerUser = async (data) => {
  const userExists = await userRepository.getUserByCpf(data.cpf);
  if (userExists) {
    throw { status: 409, message: "Cpf já cadastrado!" };
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(data.password, salt);

  data.password = passwordHash;
  await userRepository.create(data);
  return { msg: "Usuário criado com sucesso!" };
};

const loginUser = async (cpf, password, role) => {
  const user = await userRepository.getUserByCpf(cpf);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    throw { status: 401, message: "Senha inválida!" };
  }

  if (user.role !== role) {
    throw { status: 403, message: "Acesso diferente do cadastrado!" };
  }

  const secret = process.env.SECRET;
  const token = jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: "5h",
  });
  return { message: "Autenticado com sucesso!", token };
};

const getAll = async (page) => {
  const limit = 10;
  const offSet = page * limit;

  const users = await userRepository.getAllUsers(offSet, limit);

  if (users.length === 0) {
    throw { status: 404, message: "Nenhum usuário encontrado!" };
  }
  return users;
};

const getAllUsersButton = async () => {
  return await userRepository.getAllUsersButton();
};

const getUserById = async (id) => {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }
  return user;
};

const getUserByCPF = async (cpf) => {
  const user = await userRepository.getUserByCpf(cpf);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }
  return user;
};

const updateProfile = async (user, data) => {
  const userEdit = await userRepository.getUserById(user);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }
  await userRepository.updateProfile(userEdit._id, data);
};

const updatePasswordUser = async (data) => {
  const user = await userRepository.getUserByCpf(data.cpf);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(data.password, salt);

  data.password = passwordHash;
  await userRepository.updateProfile(user._id, data);
};

const deleteUser = async (id) => {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }
  await userRepository.deleteUser(user._id);
  return { message: "Usuário deletado com sucesso!" };
};
module.exports = {
  registerUser,
  loginUser,
  getAll,
  getAllUsersButton,
  getUserByCPF,
  getUserById,
  updateProfile,
  updatePasswordUser,
  deleteUser
};
