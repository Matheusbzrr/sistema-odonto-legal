const userService = require("../services/userService");
const userDTO = require("../dtos/userDTO");
const { z } = require("zod");

const createUser = async (req, res) => {
  if (!req.body) {
    return res.status(422).json({ message: "Verifique os dados informados!" });
  }

  try {
    const validatedData = userDTO.userCreateDTO.parse(req.body);
    const { msg } = await userService.registerUser(validatedData);
    return res.status(201).json({ msg });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors,
      });
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  if (!req.body.cpf || !req.body.password || !req.body.role) {
    return res.status(422).json({
      message: "CPF e senha e a sua identificação são obrigatórios!",
    });
  }

  try {
    const validatedData = userDTO.userLoginDTO.parse(req.body);

    const result = await userService.loginUser(
      validatedData.cpf,
      validatedData.password,
      validatedData.role
    );
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors,
      });
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  if (req.query.page < 1) {
    return res.status(422).json({ message: "Página inválida!" });
  }

  try {
    const users = await userService.getAll(req.query.page);
    const resUsersDTO = userDTO.listUsersResponseWithAddressDTO.parse(users);
    return res.status(200).json(resUsersDTO);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors,
      });
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const getAllUsersButton = async (req, res) => {
  try {
    const users = await userService.getAllUsersButton();
    return res.status(200).json(users);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const getProfileUser = async (req, res) => {
  if (!req.userId) {
    return res.status(422).json({ message: "Token inválido" });
  }

  try {
    const user = await userService.getUserById(req.userId);
    const resUserDTO = userDTO.userResponseWithAddressDTO.parse(user);
    return res.status(200).json(resUserDTO);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação dos dados",
        errors: error.errors,
      });
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  if (!req.query.cpf) {
    return res.status(422).json({ message: "Informe um cpf para pesquisar!" });
  }
  try {
    const userReq = req.query.cpf;
    if (typeof userReq !== "string" || userReq.length != 11) {
      return res
        .status(422)
        .json({ message: "Passe apenas os digitos do cpf." });
    }
    const userRes = await userService.getUserByCPF(userReq);
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

const updatePassword = async (req, res) => {
  const { cpf, password } = req.body;

  if (!cpf || typeof cpf !== "string") {
    return res.status(422).json({ message: "CPF é obrigatório!" });
  }

  if (!password || typeof password !== "string") {
    return res.status(422).json({ message: "Senha é obrigatória!" });
  }

  try {
    const result = await userService.updatePasswordUser({ cpf, password });
    return res.status(201).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const data = req.body;
  const userToBeEditaded = req.query.id;

  if (!data) {
    return res.status(422).json({ message: "Dados obrigatórios inválidos!" });
  }
  if (!userToBeEditaded) {
    return res.status(401).json({ message: "Informe um usuário" });
  }
  try {
    const validatedData = userDTO.updateDTO.parse(data);
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

const deleteUser = async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res.status(422).json({ message: "Informe um id para deletar!" });
  }
  try {
    await userService.deleteUser(userId);
    return res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getAllUsersButton,
  getUser,
  getProfileUser,
  updatePassword,
  updateProfile,
  deleteUser
};
