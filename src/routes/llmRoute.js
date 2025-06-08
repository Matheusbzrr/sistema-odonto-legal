const { Router } = require("express");
const llmController = require("../controllers/llmController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

router.get(
  "/generate/laudo",
  validateToken(["ADMIN", "PERITO"]),
  llmController.generateResponseEvidence
);

router.get(
  "/generate/case",
  validateToken(["ADMIN", "PERITO"]),
  llmController.generateResponseCase
);

module.exports = router;
