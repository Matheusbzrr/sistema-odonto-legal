const { Router } = require("express");
const caseController = require("../controllers/caseController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

// cria novo caso
router.post("/cases", validateToken(["ADMIN", "PERITO"]), caseController.createCase);

// busca por ID
router.get("/cases/:id", validateToken(["ADMIN", "PERITO", "ASSISTENTE"]), caseController.getCaseById);

// lista todos os casos paginados
router.get("/cases/all/:page", validateToken(["ADMIN", "PERITO", "ASSISTENTE"]), caseController.getAllCases);

// lista casos por status
router.get("/cases/status/:status/:page", validateToken(["ADMIN", "PERITO", "ASSISTENTE"]), caseController.getCasesByStatus);

// atualiza status do caso
router.put("/cases/status/:id", validateToken(["ADMIN"]), caseController.updateStatusCaseById);

module.exports = router;
