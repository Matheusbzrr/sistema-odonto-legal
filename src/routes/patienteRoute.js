const { Router } = require("express");
const patientController = require("../controllers/patientController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

/**
 * @swagger
 * /api/patient/create:
 *   post:
 *     summary: Cria uma nova Vitima
 *     tags: [Vitimas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nic:
 *                 type: string
 *               name:
 *                 type: string
 *                 example: "N/A"
 *               age:
 *                 type: integer (opcional)
 *               cpf:
 *                 type: string (opcional)
 *               gender:
 *                 type: string (opcional)
 *               identificationStatus:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vitima criado com sucesso
 */
router.post(
  "/create",
  validateToken(["ADMIN", "PERITO"]),
  patientController.createPatient
);

/**
 * @swagger
 * /api/patient/all/{page}:
 *   get:
 *     summary: Lista todos os Vitimas paginados
 *     tags: [Vitimas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de Vitimas retornada com sucesso
 */
router.get(
  "/all/:page?",
  validateToken(["ADMIN", "PERITO"]),
  patientController.getAllPatients
);

/**
 * @swagger
 * /api/patient/search/{nic}:
 *   get:
 *     summary: Busca um Vitima por NIC
 *     tags: [Vitimas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nic
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vitima encontrado
 */
router.get(
  "/search/:nic?",
  validateToken(["ADMIN", "PERITO"]),
  patientController.getPatient
);

/**
 * @swagger
 * /api/patient/update/{nic}:
 *   put:
 *     summary: Atualiza os dados de um Vitima pelo NIC
 *     tags: [Vitimas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nic
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Vitima atualizado com sucesso
 */
router.put(
  "/update/:nic?",
  validateToken(["ADMIN", "PERITO"]),
  patientController.updatePatient
);

/**
 * @swagger
 * /api/patient/update:
 *   put:
 *     summary: Atualiza os dados de um Vitima (via body)
 *     tags: [Vitimas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Vitima atualizado com sucesso
 */
router.put(
  "/update",
  validateToken(["ADMIN", "PERITO"]),
  patientController.updatePatient
);

module.exports = router;
