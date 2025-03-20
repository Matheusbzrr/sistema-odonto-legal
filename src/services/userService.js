const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

const registerUser = async (data) => {
  // verifica se o usuário já existe
  const userExists = await userRepository.getUserByEmail(data.email);
  if (userExists) throw new Error("E-mail já cadastrado!");

  // criptografa a senha
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(data.password, salt);

  // atualiza o objeto de dados para armazenar a senha criptografada
  data.password = passwordHash;

  // chama o repositório para criar o usuário
  const user = await userRepository.create(data);

  // retorna uma resposta após a criação
  return { msg: "Usuário criado com sucesso!"};
};

const loginUser = async (email, password) => {
  const user = await userRepository.getUserByEmail(email);
  if (!user) throw new Error("Usuário não encontrado!");

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) throw new Error("Senha inválida!");

  const secret = process.env.SECRET;
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });

  return { msg: "Autenticado com sucesso!", token };
};

const getUserByEmail = async (email) => {
  const user = await userRepository.getUserByEmail(email);

  if (!user) {
    throw new Error("Usuário não encontrado!");
  }

  return user;
};

module.exports = { registerUser, loginUser, getUserByEmail };
