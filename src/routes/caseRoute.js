const { Router } = require("express");
const caseController = require("../controllers/caseController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

// cria novo caso
router.post(
  "/create",
  validateToken(["ADMIN", "PERITO"]),
  caseController.createCase
);

// lista todos os casos paginados
router.get(
  "/search/all",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  caseController.getAllCases
);

//busca todos os casos q o usuario logado a envolvido
router.get(
  "/search/mycases",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  caseController.getCasesByInUser
);

// busca caso por cpf de usuario
router.get(
  "/search/byuser",
  validateToken(["ADMIN"]),
  caseController.getCasesByCpfUser
);

// busca 1 caso por protocol. (não usa esse por enquanto)
router.get(
  "/search/protocol",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  caseController.getCaseByProtocol
);

// lista casos por status
router.get(
  "/search/status",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  caseController.getCasesByStatus
);

// lista casos por data de criacao
router.get(
  "/search/date",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  caseController.getCasesByDate
);

// atualiza status do caso
router.patch(
  "/edit/status/protocol",
  validateToken(["ADMIN", "PERITO"]),
  caseController.updateStatusCaseByProtocol
);

router.put(
  "/data/protocol",
  validateToken(["ADMIN", "PERITO"]),
  caseController.updateDataCase
);

module.exports = router;
