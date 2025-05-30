const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { protect } = require("../middlewares/authMiddleware"); // ✅ Corrigé

// 🔁 Modifier le profil de l’utilisateur connecté
router.put("/", protect, async (req, res) => {
  const userId = req.user.id;
  const { username, email, photo_url } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE users SET username = ?, email = ?, photo_url = ? WHERE id = ?",
      [username, email, photo_url, userId]
    );

    res.json({ message: "Profil mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
