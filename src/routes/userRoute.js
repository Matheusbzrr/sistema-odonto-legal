const { Router } = require("express");
const userController = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");
const router = Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, PERITO, ASSISTENTE]
 *                 example: ADMIN
 *               cpf:
 *                 type: string
 *                 example: "00100200345"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
router.post("/login", userController.loginUser);

/**
 * @swagger
 * /api/alter/password:
 *   put:
 *     summary: Altera a senha do usuário logado
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 */
router.put("/alter/password", userController.updatePassword);

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Cadastra um novo usuário (admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post("/register", validateToken(["ADMIN"]), userController.createUser);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Retorna os dados do usuário logado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil retornado com sucesso
 */
router.get(
  "/profile",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  userController.getProfileUser
);

/**
 * @swagger
 * /api/search/all/{page}:
 *   get:
 *     summary: Lista todos os usuários paginados
 *     tags: [Usuários]
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
 *         description: Lista retornada com sucesso
 */
router.get(
  "/search/all/:page?",
  validateToken(["ADMIN", "PERITO"]),
  userController.getAllUsers
);


router.get(
  "/search/button",
  validateToken(["ADMIN", "PERITO"]),
  userController.getAllUsersButton
);


router.get("/oneuser", validateToken(["ADMIN"]), userController.getUser);

/**
 * @swagger
 * /api/user/profile/{id}:
 *   put:
 *     summary: Atualiza o perfil de um usuário pelo ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *         description: Perfil atualizado com sucesso
 */
router.put(
  "/user/profile/:id?",
  validateToken(["ADMIN"]),
  userController.updateProfile
);

/**
 * @swagger
 * /api/user/delete:
 *   delete:
 *     summary: Deleta um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 */
router.delete(
  "/user/delete",
  validateToken(["ADMIN"]),
  userController.deleteUser
);

module.exports = router;
