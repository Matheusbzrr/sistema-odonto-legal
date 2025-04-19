const { Router } = require("express");
const dashController = require("../controllers/dashController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

router.get("/cases/district", dashController.getCasesAndDistrict);
router.get("/cases/date", dashController.getCasesByDate);
router.get("/cases/status", dashController.getCasesByStatus);
router.get("/victims/status", dashController.getVitimsByStatusOfIdentification);

module.exports = router;
