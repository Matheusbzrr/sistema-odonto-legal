const { Router } = require("express");
const caseController = require("../controllers/caseController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

// cria novo caso
router.post("/create", validateToken(["ADMIN", "PERITO"]), caseController.createCase);

// lista todos os casos paginados
router.get("/all/:page", validateToken(["ADMIN", "PERITO", "ASSISTENTE"]), caseController.getAllCases);

// busca caso por por ID. avaliar trocar para enviar nic
router.get("/search/case", validateToken(["ADMIN", "PERITO", "ASSISTENTE"]), caseController.getCaseByNic);

// lista casos por status
router.get("/status/search/:page", validateToken(["ADMIN", "PERITO", "ASSISTENTE"]), caseController.getCasesByStatus);

// atualiza status do caso
router.put("/status/:nic", validateToken(["ADMIN", "PERITO"]), caseController.updateStatusCaseByNic);

module.exports = router;
