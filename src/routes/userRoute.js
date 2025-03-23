const { Router } = require("express");
const userController = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");
const router = Router();

// rotas comuns á todos usuarios
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.put("/alter/pass", userController.updatePassword);

// busca perfil do usuario
router.get(
  "/profile",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]), // a validacao ta com todas as roles mas so server mesmo nesse caso pra injetar o id do usuario e a role pelo middleware
  userController.getProfileUser
);

// filtro para buscar usuarios aprovados na aplicação
router.get(
  "/users/filter/:page",
  validateToken(["ADMIN"]),
  userController.filterGetUsersStatus
);

// att status
router.put(
  "/user/status/:id",
  validateToken(["ADMIN"]),
  userController.updateStatusUserById
);

// edita perfil do usuario
router.put(
  "/user/profile",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  userController.updateProfile
);

// edita endereço usuario
router.put(
  "/user/address",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  userController.updateAddress
);

//admin exclui usuario
router.delete(
  "/user/delete",
  validateToken(["ADMIN"]),
  userController.deleteUser
);

module.exports = router;
