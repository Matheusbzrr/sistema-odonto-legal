const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

const registerUser = async (data) => {
  // verifica se o usuário já existe
  const userExists = await userRepository.getUserByEmail(data.email);
  if (userExists) {
    throw { status: 409, message: "E-mail já cadastrado!" };
  }

  // criptografa a senha
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(data.password, salt);

  // atualiza o objeto de dados para armazenar a senha criptografada
  data.password = passwordHash;

  // chama o repositório para criar o usuário
  const user = await userRepository.Create(data);

  // retorna uma resposta após a criação
  return { msg: "Usuário criado com sucesso!" };
};

const loginUser = async (email, password, role) => {
  try {
    // busca o usuario no banco de dados pelo email pq libera a senha
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw { status: 404, message: "Usuário não encontrado!" };
    }

    // verifica a senha com bcrypt q é uma biblioteca
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      throw { status: 401, message: "Senha inválida!" };
    }

    if (user.role !== role) {
      throw { status: 403, message: "Acesso diferente do cadastrado!" };
    }

    // obtem o a chave do token no .env
    const secret = process.env.SECRET;

    // gera o token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, secret, {
      expiresIn: "5h",
    });

    // retorna o resultado para o controller
    return { message: "Autenticado com sucesso!", token };
  } catch (error) {
    // lança o erro para ser tratado no controller
    throw error;
  }
};

module.exports = { registerUser, loginUser };
