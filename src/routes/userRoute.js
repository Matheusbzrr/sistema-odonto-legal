const { Router } = require("express");
const userController = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");
const router = Router();

// rota teste
router.get("/", (req, res) => {
  res.json({ message: "API rodando!" });
});

// rota teste admin
router.get("/admin", validateToken("ADMIN"), (req, res) => {
  res.send("Bem-vindo, ADMIN!");
});


// toras de usuario
router.post("/register", userController.CreateUser);
router.post("/login", userController.loginUser);

module.exports = router;
