const userService = require("../services/userService");
const userDTO = require("../dtos/userDTO");
const { z } = require("zod");

const CreateUser = async (req, res) => {
  try {
    // valida a entrada da requisição com o userCreateDTO
    
    
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
  try {

    // valida se os dados da requisição estão presentes
    if (!req.body.email || !req.body.password || !req.body.role) {
      return res.status(400).json({ message: "Email e senha e a sua identificação são obrigatórios!" });
    }

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

module.exports = { CreateUser, loginUser };
