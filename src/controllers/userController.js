const userService = require("../services/userService");
const { userCreateDTO, userResponseDTO } = require("../dtos/userDTO");
const { z } = require("zod");

const CreateUser = async (req, res) => {
  try {
    // Valida a entrada da requisição com o userCreateDTO
    const validatedData = userCreateDTO.parse(req.body); // Isso valida os dados e lança um erro se algo for inválido

    // Chama o serviço para registrar o usuário com os dados validados
    const { msg } = await userService.registerUser(validatedData);

    // Retorna a resposta com o status de criação e os dados do usuário
    return res.status(201).json({ msg });
  } catch (error) {
    // Se o erro for de validação, Zod lança um erro com detalhes
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação",
        errors: error.errors, // Exibe os erros de validação
      });
    }

    // Se o erro for outro (ex.: erro do banco de dados), retorna a mensagem de erro genérica
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { CreateUser };
