const { Router } = require("express");
const dashController = require("../controllers/dashController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

/**
 * @swagger
 * /api/dash/cases/district:
 *   get:
 *     summary: Retorna a contagem de casos por bairro
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Lista de bairros com total de casos
 */
router.get("/cases/district", dashController.getCasesAndDistrict);

/**
 * @swagger
 * /api/dash/cases/date:
 *   get:
 *     summary: Retorna a quantidade de casos por data
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Casos agrupados por data
 */
router.get("/cases/date", dashController.getCasesByDate);

/**
 * @swagger
 * /api/dash/cases/status:
 *   get:
 *     summary: Retorna a quantidade de casos por status
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Casos agrupados por status
 */
router.get("/cases/status", dashController.getCasesByStatus);

/**
 * @swagger
 * /api/dash/victims/status:
 *   get:
 *     summary: Retorna a quantidade de vítimas por status de identificação
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Vítimas agrupadas por status
 */
router.get("/victims/status", dashController.getVitimsByStatusOfIdentification);

module.exports = router;