const { Router } = require("express");
const patientController = require("../controllers/patientController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

router.post(
  "/create",
  validateToken(["ADMIN", "PERITO"]),
  patientController.createPatient
);

router.get(
  "/all/:page?",
  validateToken(["ADMIN", "PERITO"]),
  patientController.getAllPatients
);

router.get(
  "/search/:nic?",
  validateToken(["ADMIN", "PERITO"]),
  patientController.getPatient
);

router.put(
  "/update/:nic?",
  validateToken(["ADMIN", "PERITO"]),
  patientController.updatePatient
);

router.put(
  "/update",
  validateToken(["ADMIN", "PERITO"]),
  patientController.updatePatient
);

module.exports = router;
