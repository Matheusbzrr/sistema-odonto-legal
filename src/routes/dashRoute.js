const { Router } = require("express");
const dashController = require("../controllers/dashController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

router.get(
  "/cases/district",

  dashController.getCasesAndDistrict
);


module.exports = router;
