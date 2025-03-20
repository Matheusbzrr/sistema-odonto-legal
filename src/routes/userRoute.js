const { Router } = require("express");
const userController = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API rodando!" });
});

router.get("/admin", validateToken("ADMIN"), (req, res) => {
  res.send("Bem-vindo, ADMIN!");
});

router.post("/register", userController.CreateUser);

module.exports = router;
