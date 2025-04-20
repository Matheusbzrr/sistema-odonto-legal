const { Router } = require("express");
const caseReportController = require("../controllers/caseReportRepository");
const validateToken = require("../middlewares/validateToken");

const router = Router();
/**
 * @swagger
 * /api/case/report/case:
 *   post:
 *     summary: Cria um relatório de caso
 *     tags: [Relatórios de Casos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               caseId:
 *                 type: string
 *                 example: "8c421109-c3a9-42a6-8e7e-53cf36905fe4"
 *     responses:
 *       201:
 *         description: Relatório criado com sucesso
 *       400:
 *         description: Dados inválidos ou falta de informações
 *       401:
 *         description: Token inválido ou ausente
 *       403:
 *         description: Acesso não permitido
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  "/case",
  validateToken(["ADMIN", "PERITO"]),
  caseReportController.createReport
);



module.exports = router;