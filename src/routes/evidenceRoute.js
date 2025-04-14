const { Router } = require("express");
const evidenceController = require("../controllers/evidenceController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

router.post(
  "/create/:protocol?",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  evidenceController.createEvidence
);



router.get(
  "/search/:evidenceId?",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  evidenceController.getEvidenceById
);

router.put(
  "/update/:evidenceId?",
  validateToken(["ADMIN", "PERITO"]),
  evidenceController.updateEvidence
);

module.exports = router;
