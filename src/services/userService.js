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
  if (user.status === "PENDENTE") {
    throw { status: 403, message: "Usuário pendente de confirmação!" };
  }

  if (user.status === "NEGADO") {
    throw { status: 403, message: "Usuário sem autorização de acesso!" };
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

// buscar um perfil do usuario
const getUserById = async (id) => {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }
  return user;
};

// filtro de admin pra procurar os aprovados
const filterGetUsersStatus = async (page, data) => {
  const limit = 3; // Limite de itens (nesse caso users) por página, pode alterar pra testar
  const offSet = page * limit; // Calcula o ponto de partida baseado na página solicitada, ou seja, se eu passar 1 ele vai multiplicar o  1 da pagina * o limite que é 10 e mostar a partir do 0 até o 9 (os 10 primeiros) ignorando os anteriores, se eu passar page 2 ele vai calcular a partir do 10 até o 19 ignorando os anteriores e assim sucessivamente

  const status = data;
  // busca todos usuarios com status APROVADO no banco
  const users = await userRepository.getUsersStatus(offSet, limit, status);

  if (users.length === 0) {
    throw { status: 404, message: "Nenhum usuário encontrado!" };
  }

  // retorna os resultados para o controller
  return users;
};

// att status de usuario
const updateStatusUser = async (id, status, responseBy) => {
  const validateApprover = await userRepository.getUserById(responseBy);
  if (!validateApprover) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }
  // atualiza o status do usuario no banco
  const user = await userRepository.updateStatus(
    id,
    status,
    validateApprover.name
  );

  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }

  if (user.status !== status) {
    throw { status: 422, message: "Status inválido!" };
  }
};

// att senha (para antes de entrar sistema)
const updatePasswordUser = async (email, newPassword) => {
  const validateEmail = await userRepository.getUserByEmail(email);

  if (!validateEmail) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }

  // criptografa a nova senha
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  // atualiza a senha do usuario no banco
  await userRepository.updatePassword(validateEmail._id, passwordHash);
};

const updateProfile = async (id, data) => {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }

  // verifica se o email novo é diferente do antigo para pode atualizar, se for igual o antigo a requisição acontece mas nao muda nada, se for diferente ele busca algum usuario com o email que será passado, se encontrar, devolve um erro, senao atualiza o campo.
  if (data.email && data.email !== user.email) {
    const validateEmail = await userRepository.getUserByEmail(data.email);
    if (validateEmail) {
      throw { status: 409, message: "E-mail já cadastrado!" };
    }
  }

  // atualiza os dados do usuario no banco
  await userRepository.updateProfile(id, data);
};

const updateAddress = async (id, data) => {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }
  // atualiza os dados do endereço no banco
  const updatedUser = await userRepository.updateUserAddress(id, data);
};

const deleteUser = async (cpf) => {
  const user = await userRepository.getUserByCpf(cpf);

  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }
  // deleta o usuario do banco de dados
  const userDeleted = await userRepository.deleteUser(user._id);

  if (userDeleted) {
    throw { status: 404, message: "Falha ao deletar usuário!" };
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  filterGetUsersStatus,
  updateStatusUser,
  updatePasswordUser,
  updateProfile,
  updateAddress,
  deleteUser,
};
