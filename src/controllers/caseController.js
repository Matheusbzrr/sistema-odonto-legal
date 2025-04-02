const caseService = require("../services/caseService");
const caseDTO = require("../dtos/caseDTO");
const { z } = require("zod");

// cria um novo caso
const createCase = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Verifique os dados informados!" });
  }

  try {
    const userId = req.userId; // recupera o id do usuario q foi implantando no jwt e decodificado pelo middleware
    const validatedData = caseDTO.caseCreateDTO.parse(req.body);
    const result = await caseService.createCase(validatedData, userId); // passa os dados e o id do usuario achado
    return res.status(201).json(result);
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

// lista todos os casos com paginação
const getAllCases = async (req, res) => {
  const page = req.params.page - 1;
  if (page < 0) {
    return res.status(400).json({ message: "Página inválida!" });
  }

  try {
    const result = await caseService.getAllCases(page);
    const validated = caseDTO.caseListDTO.parse(result); // tirei o dto do service e trouxe para o controller
    return res.status(200).json(validated);
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

// BUSCAR CASO ONDE USER LOGADO ESTA ENVOLVIDO
const getCasesByInUser = async (req, res) => {
  const page = req.params.page - 1;
  if (page < 0) {
    return res.status(400).json({ message: "Página inválida!" });
  }
  try {
    const cases = await caseService.casesByUser(page, req.userId);
    const validatedResponse = caseDTO.caseListDTO.parse(cases);
    return res.status(200).json(validatedResponse);
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

// busca casos onde usuario buscado por CPF esta envolvido
const getCasesByCpfUser = async (req, res) => {
  const page = req.params.page - 1;
  if (page < 0) {
    return res.status(400).json({ message: "Página inválida!" });
  }

  if (!req.body.cpf) {
    return res.status(400).json({ message: "CPF do não foi passado." });
  }

  try {
    const cpf = req.body.cpf;
    if (typeof cpf !== "string" || cpf.length !== 11) {
      return res
        .status(400)
        .json({ message: "Passe o cpf no formato correto." });
    }

    const cases = await caseService.casesByCpfUser(page, cpf);
    const validatedResponse = caseDTO.caseListDTO.parse(cases);
    return res.status(200).json(validatedResponse);
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

// busca caso por Nic
const getCaseByNic = async (req, res) => {
  if (!req.body.nic) {
    return res.status(400).json({ message: "Nic do não foi passado." });
  }

  try {
    const nic = req.body.nic;
    if (typeof nic !== "string") {
      return res
        .status(400)
        .json({ message: "Passe o nic no formato correto." });
    }

    const result = await caseService.getCaseByNic(nic);
    const validated = caseDTO.caseResponseDTO.parse(result);
    return res.status(200).json(validated);
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

// lista casos por status com paginação
const getCasesByStatus = async (req, res) => {
  const page = req.params.page - 1;
  if (page < 0) {
    return res.status(400).json({ message: "Página inválida!" });
  }

  if (!req.body) {
    return res.status(400).json({ message: "É necessário informar o status." });
  }

  try {
    const result = await caseService.getCasesByStatus(req.body.status, page);
    const validated = caseDTO.caseListDTO.parse(result);
    return res.status(200).json(validated);
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

// atualiza o status de um caso
const updateStatusCaseByNic = async (req, res) => {
  if (!req.params.nic) {
    return res
      .status(400)
      .json({ message: "É obrigatório passar NIC do caso !" });
  }

  if (!req.body) {
    return res
      .status(400)
      .json({ message: "É necessário informar o novo status." });
  }

  try {
    const validated = caseDTO.caseUpdateStatusDTO.parse(req.body);
    await caseService.updateCaseStatus(
      req.userId,
      req.params.nic,
      validated.status
    );
    return res.status(204).json();
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

const updateDataCase = async (req, res) => {
  if (!req.params.nic) {
    return res.status(404).json({ message: "Caso não encontrado" });
  }

  if (!req.body) {
    return res.status(404).json({ message: "Dados não encontrados" });
  }

  try {
    const validated = caseDTO.caseUpdateDataDTO.parse(req.body);
    const result = await caseService.updateCaseData(
      validated,
      req.userId,
      req.params.nic
    );
    res.status(204).json(result);
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

module.exports = {
  createCase,
  getAllCases,
  getCasesByInUser,
  getCasesByCpfUser,
  getCaseByNic,
  getCasesByStatus,
  updateStatusCaseByNic,
  updateDataCase,
};
