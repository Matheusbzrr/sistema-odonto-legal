const { Router } = require("express");
const reportController = require("../controllers/reportController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

router.get(
  "/generate",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  reportController.getReport
);

module.exports = router;
