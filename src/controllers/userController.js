const userService = require("../services/userService");
const userDTO = require("../dtos/userDTO");
const { z } = require("zod");

// criar usuario
const createUser = async (req, res) => {
  // valida se tem algum dado na entrada da requisição com o userCreateDTO
  if (!req.body) {
    return res.status(422).json({ message: "Verifique os dados informados!" });
  }

  try {
    // isso valida os dados e lança um erro se algo for invalido
    const validatedData = userDTO.userCreateDTO.parse(req.body);

    // chama o serviço para registrar o usuário com os dados validados e recebe uma mesnagem do servico
    const { msg } = await userService.registerUser(validatedData);

    // retorna a mensagem do servico com o status de criação
    return res.status(201).json({ msg });
  } catch (error) {
    // se o erro for de validação, o zod lança um erro com detalhes
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors, // exibe os erros de validação
      });
    }

    // se houver algum erro estruturado no serviço, vai ser capiturado e mostrado aqui
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    // se o erro for outro (ex.: erro do banco de dados), retorna a mensagem de erro genérica
    return res.status(500).json({ message: error.message });
  }
};

// realizar login(avaliar dps a separação a nivel de arquivos/pastas)
const loginUser = async (req, res) => {
  // valida se os dados da requisição estão presentes
  if (!req.body.cpf || !req.body.password || !req.body.role) {
    return res.status(422).json({
      message: "CPF e senha e a sua identificação são obrigatórios!",
    });
  }

  try {
    // valida a entrada da requisição com o userLoginDTO
    const validatedData = userDTO.userLoginDTO.parse(req.body);

    // chama o serviço para efetuar o login com os dados validados e recebe um resultado do servico com uma mensagem e o token
    const result = await userService.loginUser(
      validatedData.cpf,
      validatedData.password,
      validatedData.role
    );

    // retorna a resposta com o status de criação e os dados do token
    return res.status(200).json(result);
  } catch (error) {
    // se o erro for de validação, o zod lança um erro com detalhes
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors, // exibe os erros de validação
      });
    }

    // se o service lançou um erro estruturado, usa o status informado e a sua mensagem. basta isso para tratar erros na camada de logica
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    // se o erro for outro (ex.: erro do banco de dados), retorna a mensagem de erro genérica
    return res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  if (req.params.page < 1) {
    return res.status(422).json({ message: "Página inválida!" });
  }

  try {
    const users = await userService.getAllUsers(req.params.page);
    const resUsersDTO = userDTO.listUsersResponseWithAddressDTO.parse(users);
    return res.status(200).json(resUsersDTO);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors, // exibe os erros de validação
      });
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// chama o perfil do usuario logado
const getProfileUser = async (req, res) => {
  console.log(req.userId);
  // valida se o id do usuario está presente na requisição injetado pelo middleware de autenticação
  if (!req.userId) {
    return res.status(422).json({ message: "Token inválido" });
  }

  try {
    // chama o serviço para buscar um usuário pelo ID
    const user = await userService.getUserById(req.userId);
    // transforma os dados do usuário em um formato de resposta
    const resUserDTO = userDTO.userResponseWithAddressDTO.parse(user);
    return res.status(200).json(resUserDTO);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors, // exibe os erros de validação
      });
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  if (!req.body) {
    return res.status(422).json({ message: "Informe um cpf para pesquisar!" });
  }
  try {
    const userReq = req.body.cpf;
    // valida se o cpf está presente na requisição
    if (typeof userReq !== "string" || userReq.length != 11) {
      return res
        .status(422)
        .json({ message: "Passe apenas os digitos do cpf." });
    }

    // chama o serviço para buscar um usuário pelo CPF
    const userRes = await userService.getUserByCPF(userReq);
    // transforma os dados do usuário em um formato de resposta
    const resUserDTO = userDTO.userResponseWithAddressDTO.parse(userRes);
    return res.status(200).json(resUserDTO);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors, // exibe os erros de validação
      });
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// filta o status da solicitação
const filterGetUsersStatus = async (req, res) => {
  // valida se a pagiana no parametro da url
  if (req.params.page < 1) {
    return res.status(422).json({ message: "Página inválida!" });
  }

  if (!req.body) {
    return res.status(422).json({
      message:
        "É necessário enviar qual tipo de usuario voce quer filtrar: APROVADO, PENDENTE ou NEGADO.",
    });
  }

  try {
    // obtém a página a ser consultada e subtrai 1 para transformar a página do cliente em uma página do mongo, pois no mongo começa a contar em 0, isso tbm ajuda o front quando for mandar a pagina e não precisa começar exatamente no 0 la no front
    const page = req.params.page - 1;

    // valida a entrada da requisição com o validEnumDTO
    const validatedData = userDTO.validEnumDTO.parse(req.body);

    // passa a página para o serviço e recebe os usuários aprovados
    const users = await userService.filterGetUsersStatus(
      page,
      validatedData.status
    );

    // transforma os dados dos usuários em um formato de resposta
    const resUsersDTO = userDTO.userResponseFiltersDTO.parse(users);
    return res.status(200).json(resUsersDTO);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors, // exibe os erros de validação
      });
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// atualiza o status do usuario pelo id
const updateStatusUserById = async (req, res) => {
  // valida se o id do usuário e o novo status foram fornecidos
  if (!req.params.id || !req.body.status) {
    return res
      .status(422)
      .json({ message: "Id do usuário e status são obrigatórios!" });
  }

  try {
    const responseBy = String(req.userId); // pego o Id do user diretamente pois injetado no middleware de autenticação e converte para string
    const id = req.params.id; // pego o id do usuário a ser atualizado no parametro da requisição (url)
    const status = req.body.status; // pego o novo status do usuário a ser atualizado no corpo da requisição (playload)

    const data = { status, responseBy }; // tive problema em passar dois parametros direto no parse, então criei um objeto com os dois parametros

    // valida a entrada da requisição com o userUpdateStatusDTO
    const validatedData = userDTO.userUpdateStatusDTO.parse(data);

    // chama o serviço para atualizar o status do usuário com os dados validados e recebe um resultado do servico com uma mensagem
    await userService.updateStatusUser(
      id,
      validatedData.status,
      validatedData.responseBy
    );

    return res.status(204).json();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors, // exibe os erros de validação
      });
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// usuario altera sua senha (rota pulica)
const updatePassword = async (req, res) => {
  const { cpf, password } = req.body;

  if (!cpf) {
    return res.status(422).json({ message: "CPF é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ message: "Senha é obrigatória!" });
  }

  try {
    // valida cpf e senha
    const validatedData = userDTO.updatePasswordDTO.parse({ cpf, password });
    // envia cpf e senha validado
    const result = await userService.updatePasswordUser(
      validatedData.cpf,
      validatedData.password
    );
    // recebe a resposta
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors, // exibe os erros de validação
      });
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

//altera senha do usuario ja logado no sistema sem nenhum dano ao acesso do mesmo no sistema
const updatePasswordInSystem = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Token inválido" });
  }

  if (!req.body.password) {
    return res.status(422).json({ message: "Senha é obrigatória!" });
  }

  try {
    const password = req.body.password;

    if (password.length < 6 || typeof password !== "string") {
      return res.status(401).json({
        message:
          "Senha invalida. escolha 6 digitos ou mais com letras e caracteres inclusos",
      });
    }

    const result = await userService.updatePasswordInSystem(
      req.userId,
      password
    );
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors, // exibe os erros de validação
      });
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// admin altera senha do usuario
const updatePasswordByAdmin = async (req, res) => {
  if (!req.body.cpf || !req.body.password) {
    return res.status(401).json({ message: "dados invalidos" });
  }

  try {
    const data = req.body;
    const adminId = req.userId;

    const validatedData = userDTO.updatePasswordDTO.parse(data);
    const result = await userService.updatePasswordByAdmin(
      adminId,
      validatedData.cpf,
      validatedData.password
    );
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors, // exibe os erros de validação
      });
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// usuario altera alguns dados do seu perfil
const updateProfile = async (req, res) => {
  const data = req.body;
  const userToBeEditaded = req.params.id
  
  if (!data) {
    return res.status(422).json({ message: "Dados obrigatórios inválidos!" });
  }
  if (!userToBeEditaded) {
    return res.status(401).json({ message: "Informe um usuário" });
  }
  try {
    const validatedData = userDTO.updateProfileDTO.parse(data);
    await userService.updateProfile(userToBeEditaded, validatedData);
    return res.status(201).json("Perfil alterado com sucesso!");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors, // exibe os erros de validação
      });
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// admin deleta um usuario
const deleteUser = async (req, res) => {
  const cpf = req.body.cpf;
  if (!cpf) {
    return res.status(422).json({ message: "Token inválido" });
  }

  try {
    await userService.deleteUser(cpf);
    return res.status(204).json();
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUser,
  getProfileUser,
  filterGetUsersStatus,
  updateStatusUserById,
  updatePassword,
  updatePasswordInSystem,
  updatePasswordByAdmin,
  updateProfile,
  deleteUser,
};
