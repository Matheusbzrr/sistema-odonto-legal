const { Router } = require("express");
const caseReportController = require("../controllers/caseReportRepository");
const validateToken = require("../middlewares/validateToken");

const router = Router();

router.post(
  "/case",
  validateToken(["ADMIN", "PERITO"]),
  caseReportController.createReport
);



module.exports = router;