const { Router } = require("express");
const reportEvidenceController = require("../controllers/reportEvidenceController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

router.post(
  "/evidence",
  validateToken(["ADMIN", "PERITO"]),
  reportEvidenceController.createReport
);



module.exports = router;