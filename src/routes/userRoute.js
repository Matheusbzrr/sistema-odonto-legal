const { Router } = require("express");
const userController = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");
const router = Router();

// rota teste
router.get("/", (req, res) => {
  res.json({ message: "API rodando!" });
});

// rota teste admin
router.get("/admin", validateToken(["ADMIN"]), (req, res) => {
  res.send("Bem-vindo, ADMIN!");
});

// rota teste perito e admin
router.get(
  "/adminandperito",
  validateToken(["ADMIN", "PERITO"]),
  (req, res) => {
    res.send("Bem-vindo, ADMIN ou PERITO!");
  }
);

// toras de usuario
router.post("/register", userController.CreateUser);
router.post("/login", userController.loginUser);
router.get(
  "/users/:page",
  validateToken(["ADMIN"]),
  userController.getAllUsersByAdmin
);

module.exports = router;
