const userService = require("../services/userService");
const userDTO = require("../dtos/userDTO");
const { z } = require("zod");

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

const loginUser = async (req, res) => {
  // valida se os dados da requisição estão presentes
  if (!req.body.email || !req.body.password || !req.body.role) {
    return res.status(422).json({
      message: "Email e senha e a sua identificação são obrigatórios!",
    });
  }

  try {
    // valida a entrada da requisição com o userLoginDTO
    const validatedData = userDTO.userLoginDTO.parse(req.body);

    // chama o serviço para efetuar o login com os dados validados e recebe um resultado do servico com uma mensagem e o token
    const result = await userService.loginUser(
      validatedData.email,
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

    return res.status(201).json("Status alterado com sucesso!");
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

const updatePassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ message: "Email é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ message: "Senha é obrigatória!" });
  }

  try {
    const validatedData = userDTO.updatePasswordDTO.parse({ email, password });

    await userService.updatePasswordUser(
      validatedData.email,
      validatedData.password
    );

    return res.status(201).json("Senha alterada com sucesso!");
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

const updateProfile = async (req, res) => {
  const data = req.body;
  const userId = req.userId;
  if (!data || !userId) {
    return res.status(422).json({ message: "Dados obrigatórios inválidos!" });
  }
  try {
    const validatedData = userDTO.updateProfileDTO.parse(data);
    await userService.updateProfile(userId, validatedData);
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

const updateAddress = async (req, res) => {
  const user = req.userId;
  const address = req.body;
  if (!user) {
    return res.status(422).json({ message: "Token inválido" });
  }
  if (!address) {
    return res.status(422).json({ message: "Endereço é obrigatório!" });
  }
  try {
    const validatedData = userDTO.addressCreateDTO.parse(address);
    result = await userService.updateAddress(user, validatedData);
    return res.status(201).json("Endereço alterado com sucesso!");
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
  getProfileUser,
  filterGetUsersStatus,
  updateStatusUserById,
  updatePassword,
  updateProfile,
  updateAddress,
  deleteUser,
};
