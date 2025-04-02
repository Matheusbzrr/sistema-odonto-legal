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
  await userRepository.create(data);

  // retorna uma resposta após a criação
  return { msg: "Usuário criado com sucesso!" };
};

const loginUser = async (cpf, password, role) => {
  // busca o usuario no banco de dados pelo email pq libera a senha
  const user = await userRepository.getUserByCpf(cpf);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }

  // verifica se o status do usuario, se for pendente ele não faz login.
  // ATENÇÃO!!!!! se voce ainda não ier um user admin com o status aprovado, caltera direto no banco de dados o status para APROVADO (em maiusculo mesmo)
  if (user.status === "PENDENTE") {
    throw {
      status: 403,
      message: "Usuário com acesso pendente! Aguarde sua autorização.",
    };
  }

  if (user.status === "NEGADO") {
    throw {
      status: 403,
      message:
        "Usuário sem autorização de acesso! Entre em contato com um administrador para verificar o ocorrido e solicite uma nova senha.",
    };
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

const getAll = async (page) => {
  const limit = 10; 
  const offSet = page * limit; 

  const users = await userRepository.getAllUsers(offSet, limit);

  if (users.length === 0) {
    throw { status: 404, message: "Nenhum usuário encontrado!" };
  }

  // retorna os resultados para o controller
  return users;
}

// buscar um perfil do usuario
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
}

// filtro de admin pra procurar os aprovados
const filterGetUsersStatus = async (page, data) => {
  const limit = 10; // Limite de itens (nesse caso users) por página, pode alterar pra testar
  const offSet = page * limit; // Calcula o ponto de partida baseado na página solicitada, ou seja, se eu passar 1 ele vai multiplicar o  1 da pagina * o limite que é 10 e mostar a partir do 0 até o 9 (os 10 primeiros) ignorando os anteriores, se eu passar page 2 ele vai calcular a partir do 10 até o 19 ignorando os anteriores e assim sucessivamente

  const status = data;
  // busca todos usuarios com o tipo de status passado na requisição
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

  const user = await userRepository.getUserById(id);

  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }

  if (user.status === status) {
    throw {
      status: 403,
      message: "Não é possivel alterar para o mesmo status presente no.",
    };
  }

  await userRepository.updateStatus(id, status, validateApprover.name);

  return { msg: "Status do usuário atualizado com sucesso!" };
};

// atualiza senha de usuario e solicita um acesso
const updatePasswordUser = async (cpf, newPassword) => {
  // Busca usuário pelo cpf
  const user = await userRepository.getUserByCpf(cpf);

  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }

  // Verifica status do usuário antes de continuar
  if (user.status === "PENDENTE") {
    throw {
      status: 403,
      message: "Há uma pendência no acesso do usuário. Aguarde aprovação.",
    };
  }

  if (user.status === "NEGADO") {
    throw {
      status: 403,
      message:
        "Você não tem permissão para alterar a senha do usuário sem autorização. Entre em contato com um administrador para verificar o ocorrido e solicite uma nova senha.",
    };
  }
  // Criptografa a nova senha
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  // Define a solicitação e status como PENDENTE
  const solicitationTitle = "Última solicitação: Mudar a senha do usuário";
  const status = "PENDENTE";
  const responseBy = "";

  // Atualiza o status para "PENDENTE" antes de alterar a senha
  await userRepository.updatePassword(
    user._id,
    passwordHash,
    solicitationTitle,
    status,
    responseBy
  );

  // Retorna o resultado para o controller
  return {
    message:
      "Sua senha foi alterada mas é necessário um administrador liberar o acesso a plataforma. Aguarde. ",
  };
};

const updatePasswordInSystem = async (userId, newPassword) => {
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await userRepository.updatePasswordInSystem(userId, passwordHash);
  return { message: "Senha do usuário alterada com sucesso!" };
};

// admin altera senha do usuario
const updatePasswordByAdmin = async (adminId, cpf, password) => {
  const userAdmin = await userRepository.getUserById(adminId);
  const responseBy = userAdmin.name;

  const userToBeEditaded = await userRepository.getUserByCpf(cpf);

  if (!userToBeEditaded) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }

  if (userToBeEditaded.status === "APROVADO") {
    throw {
      status: 403,
      message:
        "Não é possível alterar a senha de um de maneira não solicitada.",
    };
  }

  if (userToBeEditaded.status === "PENDENTE") {
    throw {
      status: 403,
      message: "Há uma solicitção pendente. Por favor, responda.",
    };
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  await userRepository.updatePasswordByAdmin(
    userToBeEditaded._id,
    passwordHash,
    responseBy
  );

  return { message: "Senha do usuário alterada com sucesso!" };
};

const updateProfile = async (user, data) => {
  const userEdit = await userRepository.getUserById(user);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado!" };
  }
  // atualiza os dados do usuario no banco
  await userRepository.updateProfile(userEdit._id, data);
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
  getAll,
  getUserByCPF,
  getUserById,
  filterGetUsersStatus,
  updateStatusUser,
  updatePasswordUser,
  updatePasswordInSystem,
  updatePasswordByAdmin,
  updateProfile,
  updateAddress,
  deleteUser,
};
