// src/routes/caseRoute.js
const { Router } = require("express");
const caseController = require("../controllers/caseController");
const validateToken = require("../middlewares/validateToken");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Casos
 *   description: Endpoints relacionados aos casos
 */

/**
 * @swagger
 * /api/cases/create:
 *   post:
 *     summary: Cria um novo caso
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoCaso'
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 */
router.post("/create", validateToken(["ADMIN", "PERITO"]), caseController.createCase);

/**
 * @swagger
 * /api/cases/search/all:
 *   get:
 *     summary: Lista todos os casos paginados
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/search/all", validateToken(["ADMIN", "PERITO", "ASSISTENTE"]), caseController.getAllCases);

/**
 * @swagger
 * /api/cases/search/mycases:
 *   get:
 *     summary: Retorna os casos em que o usuário está envolvido
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de casos relacionados ao usuário
 */
router.get("/search/mycases", validateToken(["ADMIN", "PERITO", "ASSISTENTE"]), caseController.getCasesByInUser);

/**
 * @swagger
 * /api/cases/search/byuser:
 *   get:
 *     summary: Busca casos por CPF do usuário
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Casos encontrados com base no CPF
 */
router.get("/search/byuser", validateToken(["ADMIN"]), caseController.getCasesByCpfUser);

/**
 * @swagger
 * /api/cases/search/protocol:
 *   get:
 *     summary: Busca um caso pelo protocolo
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: protocol
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Caso retornado com sucesso
 */
router.get("/search/protocol", validateToken(["ADMIN", "PERITO", "ASSISTENTE"]), caseController.getCaseByProtocol);

/**
 * @swagger
 * /api/cases/search/status:
 *   get:
 *     summary: Lista casos filtrados por status
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ABERTO, FINALIZADO, ARQUIVADO]
 *     responses:
 *       200:
 *         description: Casos filtrados
 */
router.get("/search/status", validateToken(["ADMIN", "PERITO", "ASSISTENTE"]), caseController.getCasesByStatus);

/**
 * @swagger
 * /api/cases/search/date:
 *   get:
 *     summary: Lista casos por data de criação
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Casos ordenados por data
 */
router.get("/search/date", validateToken(["ADMIN", "PERITO", "ASSISTENTE"]), caseController.getCasesByDate);

/**
 * @swagger
 * /api/cases/edit/status/protocol:
 *   patch:
 *     summary: Atualiza o status de um caso pelo protocolo
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               protocol:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ABERTO, FINALIZADO, ARQUIVADO]
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.patch("/edit/status/protocol", validateToken(["ADMIN", "PERITO"]), caseController.updateStatusCaseByProtocol);

/**
 * @swagger
 * /api/cases/data/protocol:
 *   put:
 *     summary: Atualiza dados de um caso
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Caso atualizado
 */
router.put("/data/protocol", validateToken(["ADMIN", "PERITO"]), caseController.updateDataCase);

/**
 * @swagger
 * /api/cases/delete/protocol:
 *   delete:
 *     summary: Deleta um caso pelo protocolo
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: protocol
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Caso deletado com sucesso
 */
router.delete("/delete/protocol", validateToken(["ADMIN", "PERITO"]), caseController.deleteCase);



module.exports = router;
