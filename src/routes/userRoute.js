const { Router } = require("express");
const userController = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");
const router = Router();

// toras de usuario
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

router.get(
  "/users/approved/:page",
  validateToken(["ADMIN"]),
  userController.filterGetUsersStatusApproved
);
router.get(
  "/users/pending/:page",
  validateToken(["ADMIN"]),
  userController.filterGetUsersStatusPending
);
router.get(
  "/users/invalid/:page",
  validateToken(["ADMIN"]),
  userController.filterGetUsersStatusInvalid
);

router.put(
  "/user/status/:id",
  validateToken(["ADMIN"]),
  userController.updateSatusUserById
);

module.exports = router;
