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
  const user = await userRepository.create(data);

  // retorna uma resposta após a criação
  return { msg: "Usuário criado com sucesso!" };
};

const loginUser = async (email, password, role) => {
  // busca o usuario no banco de dados pelo email pq libera a senha
  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }

  // verifica se o status do usuario, se for pendente ele não faz login. 
  // ATENÇÃO!!!!! se voce ainda não ier um user admin com o status aprovado, caltera direto no banco de dados o status para APROVADO (em maiusculo mesmo)
  if (user.status === "PENDENTE" || user.status === "NEGADO") {
    throw { status: 403, message: "Usuário pendente de confirmação!" };
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

// filtro de admin pra procurar os aprovados
const filterGetUsersApproved = async (page) => {
  const limit = 10; // Limite de itens (nesse caso users) por página, pode alterar pra testar
  const offSet = page * limit; // Calcula o ponto de partida baseado na página solicitada, ou seja, se eu passar 1 ele vai multiplicar o  0 da pagina * o limite que é 10 e mostar a partir do 0 até o 9 (os 10 primeiros) ignorando os anteriores, se eu passar page 1 ele vai calcular a partir do 10 até o 19 ignorando os anteriores e assim sucessivamente

  // busca todos usuarios com status APROVADO no banco
  const users = await userRepository.getUsersApproved(offSet, limit);

  if (users.length === 0) {
    throw { status: 404, message: "Nenhum usuário encontrado!" };
  }

  // retorna os resultados para o controller
  return users;
};

// filtro de admin pra procurar os pendentes
const filterGetUsersPending = async (page) => {
  const limit = 10; // Limite de itens (nesse caso users) por página, pode alterar pra testar
  const offSet = page * limit; // Calcula o ponto de partida baseado na página solicitada, ou seja, se eu passar 1 ele vai multiplicar o  0 da pagina * o limite que é 10 e mostar a partir do 0 até o 9 (os 10 primeiros) ignorando os anteriores, se eu passar page 1 ele vai calcular a partir do 10 até o 19 ignorando os anteriores e assim sucessivamente

  // busca todos usuarios com status PENDENTES no banco
  const users = await userRepository.getUsersPending(offSet, limit);

  if (users.length === 0) {
    throw { status: 404, message: "Nenhum usuário encontrado!" };
  }

  // retorna os resultados para o controller
  return users;
};

// filtro de admin pra procurar os negados
const filterGetUsersInvalid = async (page) => {
  const limit = 10; // Limite de itens (nesse caso users) por página, pode alterar pra testar
  const offSet = page * limit; // Calcula o ponto de partida baseado na página solicitada, ou seja, se eu passar 1 ele vai multiplicar o  0 da pagina * o limite que é 10 e mostar a partir do 0 até o 9 (os 10 primeiros) ignorando os anteriores, se eu passar page 1 ele vai calcular a partir do 10 até o 19 ignorando os anteriores e assim sucessivamente

  // busca todos usuarios com status NEGADOS no banco
  const users = await userRepository.getUsersInvalid(offSet, limit);

  if (users.length === 0) {
    throw { status: 404, message: "Nenhum usuário encontrado!" };
  }

  // retorna os resultados para o controller
  return users;
};

const updateSatusUser = async (id, status, approvedBy) => {
  const validateApprover = await userRepository.getUserById(approvedBy);
  if (!validateApprover) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }
  // atualiza o status do usuario no banco
  const user = await userRepository.updateSatus(id, status, validateApprover.name);

  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }

  if(user.status !== status){
    throw { status: 422, message: "Status inválido!" };
  }

  // retorna a resposta para o controller
  return user;
}

module.exports = {
  registerUser,
  loginUser,
  filterGetUsersApproved,
  filterGetUsersPending,
  filterGetUsersInvalid,
  updateSatusUser,
};
