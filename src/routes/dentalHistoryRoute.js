const { Router } = require("express");
const dentalHistoryController = require("../controllers/dentalHistoryController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

router.post(
  "/create",
  validateToken(["ADMIN", "PERITO"]),
  dentalHistoryController.createExame
);

router.get(
  "/all/:page?",
  validateToken(["ADMIN", "PERITO"]),
  dentalHistoryController.getAllExams
);

module.exports = router;
