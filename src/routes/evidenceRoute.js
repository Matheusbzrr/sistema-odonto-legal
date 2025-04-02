const { Router } = require("express");
const evidenceController = require("../controllers/evidenceController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

router.post(
  "/create/:nic",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  evidenceController.createEvidence
);

router.get(
  "/all/:page",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  evidenceController.getAllEvidencesInCase
);

router.get(
  "/search/:evidenceId",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  evidenceController.getEvidenceById
);

module.exports = router;
