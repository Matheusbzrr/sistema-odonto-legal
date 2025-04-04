const { Router } = require("express");
const userController = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");
const router = Router();

// rotas comuns á todos usuarios
router.post("/login", userController.loginUser);
router.put("/alter/password", userController.updatePassword);
//

router.post("/register", validateToken(["ADMIN"]), userController.createUser);

router.get(
  "/profile",
  validateToken(["ADMIN", "PERITO", "ASSISTENTE"]),
  userController.getProfileUser
);

router.get(
  "/search/all",
  validateToken(["ADMIN", "PERITO"]),
  userController.getAllUsers
);

router.get(
  "/search/button",
  validateToken(["ADMIN", "PERITO"]),
  userController.getAllUsersButton
);

router.get("/oneuser", validateToken(["ADMIN"]), userController.getUser);

router.put(
  "/user/profile/:id",
  validateToken(["ADMIN"]),
  userController.updateProfile
);
module.exports = router;
