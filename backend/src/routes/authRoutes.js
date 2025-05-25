const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
console.log("authController =", authController);

const { protect } = require("../middlewares/authMiddleware");

// Inscription
router.post("/register", authController.register);

// Connexion
router.post("/login", authController.login);

// 🔒 Route protégée exemple
router.get("/profile", protect, (req, res) => {
  res.json({ message: "Bienvenue !", userId: req.user.id });
});

module.exports = router;
