const { Router } = require("express");
const userController = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");
const router = Router();

// rotas comuns á todos usuarios
router.post("/login", userController.loginUser);
router.put("/alter/password", userController.updatePassword);
//

// admin cadastra um novo usuario
router.post("/register", validateToken(["ADMIN"]), userController.createUser);

// busca perfil do usuario
router.get(
  "/profile",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]), // a validacao ta com todas as roles mas so server mesmo nesse caso pra injetar o id do usuario e a role pelo middleware
  userController.getProfileUser
);

router.get("/search/all", validateToken(["ADMIN", "PERITO"]), userController.getAllUsers);

router.get("/oneuser", validateToken(["ADMIN"]), userController.getUser);

// filtro para buscar usuarios por status na aplicação
router.get(
  "/users/filter/:page",
  validateToken(["ADMIN"]),
  userController.filterGetUsersStatus
);

// att senha do usuario por ele mesmo dentro do sistema
router.patch(
  "/user/newpassword",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  userController.updatePasswordInSystem
);

// att status
router.put(
  "/user/status/:id",
  validateToken(["ADMIN"]),
  userController.updateStatusUserById
);

// atualizar senha de usuario por um admin
router.put(
  "/alter/admin",
  validateToken(["ADMIN"]),
  userController.updatePasswordByAdmin
);

// edita perfil do usuario
router.put(
  "/user/profile/:id",
  validateToken(["ADMIN"]),
  userController.updateProfile
);

//admin exclui usuario
router.delete(
  "/user/delete",
  validateToken(["ADMIN"]),
  userController.deleteUser
);

module.exports = router;
