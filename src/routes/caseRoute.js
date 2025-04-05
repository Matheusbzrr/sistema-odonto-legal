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
  "/all/:page",
  validateToken(["ADMIN", "PERITO"]),
  caseController.getAllCases
);

router.get(
  "/mycases",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  caseController.getCasesByInUser
);

router.get(
  "/search/user/:page?",
  validateToken(["ADMIN"]),
  caseController.getCasesByCpfUser
);

// busca caso por por protocol.
router.get(
  "/search/protocol",
  validateToken(["ADMIN", "PERITO"]),
  caseController.getCaseByProtocol
);

// lista casos por status
router.get(
  "/search/status/:page",
  validateToken(["ADMIN", "PERITO"]),
  caseController.getCasesByStatus
);

// atualiza status do caso
router.patch(
  "/status/:protocol",
  validateToken(["ADMIN", "PERITO"]),
  caseController.updateStatusCaseByProtocol
);

router.put(
  "/data/:protocol",
  validateToken(["ADMIN", "PERITO"]),
  caseController.updateDataCase
);

module.exports = router;
