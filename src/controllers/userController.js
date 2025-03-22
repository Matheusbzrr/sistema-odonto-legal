const userService = require("../services/userService");
const userDTO = require("../dtos/userDTO");
const { z } = require("zod");

const createUser = async (req, res) => {
  // valida se tem algum dado na entrada da requisição com o userCreateDTO
  if (!req.body) {
    return res.status(400).json({ message: "Verifique os dados informados!" });
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
    return res.status(400).json({
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

const filterGetUsersStatusApproved = async (req, res) => {
  // valida se a pagiana no parametro da url
  if (req.params.page < 1) {
    return res.status(400).json({ message: "Página inválida!" });
  }
  try {
    // obtém a página a ser consultada e subtrai 1 para transformar a página do cliente em uma página do mongo, pois no mongo começa a contar em 0, isso tbm ajuda o front quando for mandar a pagina e não precisa começar exatamente no 0 la no front
    const page = req.params.page - 1;

    // passa a página para o serviço e recebe os usuários aprovados
    const users = await userService.filterGetUsersApproved(page);

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

const filterGetUsersStatusPending = async (req, res) => {
  // valida se a pagiana no parametro da url
  if (req.params.page < 1) {
    return res.status(400).json({ message: "Página inválida!" });
  }
  try {
    // obtém a página a ser consultada e subtrai 1 para transformar a página do cliente em uma página do mongo, pois no mongo começa a contar em 0, isso tbm ajuda o front quando for mandar a pagina e não precisa começar exatamente no 0 la no front
    const page = req.params.page - 1;

    // passa a página para o serviço e recebe os usuários aprovados
    const users = await userService.filterGetUsersPending(page);

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

const filterGetUsersStatusInvalid = async (req, res) => {
  // valida se a pagiana no parametro da url
  if (req.params.page < 1) {
    return res.status(400).json({ message: "Página inválida!" });
  }
  try {
    // obtém a página a ser consultada e subtrai 1 para transformar a página do cliente em uma página do mongo, pois no mongo começa a contar em 0, isso tbm ajuda o front quando for mandar a pagina e não precisa começar exatamente no 0 la no front
    const page = req.params.page - 1;

    // passa a página para o serviço e recebe os usuários aprovados
    const users = await userService.filterGetUsersInvalid(page);

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

const updateSatusUserById = async (req, res) => {
  // valida se o id do usuário e o novo status foram fornecidos
  if (!req.params.id || !req.body.status) {
    return res
      .status(400)
      .json({ message: "Id do usuário e status são obrigatórios!" });
  }

  try {
    const approvedBy = String(req.userId); // pego o Id do user diretamente pois injetado no middleware de autenticação e converte para string
    const id = req.params.id; // pego o id do usuário a ser atualizado no parametro da requisição (url)
    const status = req.body.status; // pego o novo status do usuário a ser atualizado no corpo da requisição (playload)

    const data = { status, approvedBy }; // tive problema em passar dois parametros direto no parse, então criei um objeto com os dois parametros

    // valida a entrada da requisição com o userUpdateStatusDTO
    const validatedData = userDTO.userUpdateStatusDTO.parse(data);

    // chama o serviço para atualizar o status do usuário com os dados validados e recebe um resultado do servico com uma mensagem
    const result = await userService.updateSatusUser(
      id,
      validatedData.status,
      validatedData.approvedBy
    );
    const responseUpdateStatusDTO = await userDTO.responseUpdateStatusDTO.parse(
      result
    );
    return res.status(201).json(responseUpdateStatusDTO);
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

module.exports = {
  createUser,
  loginUser,
  filterGetUsersStatusApproved,
  filterGetUsersStatusPending,
  filterGetUsersStatusInvalid,
  updateSatusUserById,
};
