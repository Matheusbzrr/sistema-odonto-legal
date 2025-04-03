const { Router } = require("express");
const patienteController = require("../controllers/patientController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

router.post(
  "/create",
  validateToken(["ADMIN", "PERITO"]),
  patienteController.createPatient
);

module.exports = router;
