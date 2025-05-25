const express = require("express");
const db = require("../config/db");
const router = express.Router();

// 🔁 Obtenir la progression
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  db.query("SELECT avancer FROM theme0 WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur." });
    if (results.length === 0) return res.status(404).json({ message: "Aucune donnée trouvée." });

    res.json({ avancer: results[0].avancer });
  });
});
// ✅ Mettre à jour la progression
router.post("/advance", (req, res) => {
    const { userId, next } = req.body;
  
    if (userId == null || next == null) {
      return res.status(400).json({ message: "Champs requis manquants." });
    }
  
    const sql = "UPDATE theme0 SET avancer = ? WHERE user_id = ? AND avancer < ?";
  
    db.query(sql, [next, userId, next], (err, result) => {
      if (err) return res.status(500).json({ message: "Erreur serveur." });
      res.json({ message: "Progression mise à jour." });
    });
  });
  
module.exports = router;
