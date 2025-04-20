const { Router } = require("express");
const reportEvidenceController = require("../controllers/reportEvidenceController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

/**
 * @swagger
 * /api/report/evidence:
 *   post:
 *     summary: Cria um laudo de evidência
 *     tags: [Laudos de Evidência]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               evidenceId:
 *                 type: string
 *                 example: "95fe3c61-70e7-4e00-94b5-0d3961d411c1"
 *               texto:
 *                 type: string
 *                 example: "A evidência apresenta fratura no osso maxilar."
 *     responses:
 *       201:
 *         description: Laudo criado com sucesso
 *       400:
 *         description: Requisição mal formatada
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso não permitido
 *       500:
 *         description: Erro interno
 */
router.post(
  "/evidence",
  validateToken(["ADMIN", "PERITO"]),
  reportEvidenceController.createReport
);

module.exports = router;
