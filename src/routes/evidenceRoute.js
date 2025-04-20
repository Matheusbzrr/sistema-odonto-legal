const { Router } = require("express");
const evidenceController = require("../controllers/evidenceController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

/**
 * @swagger
 * /api/evidence/create/{protocol}:
 *   post:
 *     summary: Cria uma evidência para um caso
 *     tags: [Evidências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: protocol
 *         required: false
 *         schema:
 *           type: string
 *         description: Protocolo do caso (opcional)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               descriptionTechnical:
 *                 type: string
 *               category:
 *                 type: string
 *                 example: "CORPO"
 *               condition:
 *                 type: string
 *                 example: "INTEGRADO"
 *               testimony:
 *                 type: string
 *               obs:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evidência criada com sucesso
 */
router.post(
  "/create/:protocol?",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  evidenceController.createEvidence
);

/**
 * @swagger
 * /api/evidence/search/{evidenceId}:
 *   get:
 *     summary: Retorna uma evidência pelo ID
 *     tags: [Evidências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: evidenceId
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evidência encontrada
 */
router.get(
  "/search/:evidenceId?",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  evidenceController.getEvidenceById
);

/**
 * @swagger
 * /api/evidence/update/{evidenceId}:
 *   put:
 *     summary: Atualiza uma evidência existente
 *     tags: [Evidências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: evidenceId
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               descriptionTechnical:
 *                 type: string
 *               obs:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evidência atualizada com sucesso
 */
router.put(
  "/update/:evidenceId?",
  validateToken(["ADMIN", "PERITO"]),
  evidenceController.updateEvidence
);

module.exports = router;