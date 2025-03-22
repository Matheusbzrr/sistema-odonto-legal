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
};

const getAllUsersByAdmin = async (page) => {
  // O codigo a baixo cria uma paginação, esse conceito impede de mandar muitos dados de uma so vez limitando a quantidade de dados, nesse caso, limito a quantidade de users que serão passados para o front
  
  const limit = 10; // Limite de itens (nesse caso users) por página, pode alterar pra testar
  const offSet = page * limit; // Calcula o ponto de partida baseado na página solicitada, ou seja, se eu passar 1 ele vai multiplicar o  0 da pagina * o limite que é 10 e mostar a partir do 0 até o 9 (os 10 primeiros) ignorando os anteriores, se eu passar page 1 ele vai calcular a partir do 10 até o 19 ignorando os anteriores e assim sucessivamente

  // busca todos os usuários no banco de dados
  const users = await userRepository.getAllUsers(offSet, limit);

  if (users.length === 0) {
    throw { status: 404, message: "Nenhum usuário encontrado!" };
  }

  if (users.length) return users;
};
module.exports = { registerUser, loginUser, getAllUsersByAdmin };
