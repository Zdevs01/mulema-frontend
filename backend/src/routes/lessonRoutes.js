const express = require("express");
const router = express.Router();
const db = require("../config/db");
const util = require("util");
const dbQuery = util.promisify(db.query).bind(db);

// ✅ Récupérer les leçons d’un utilisateur selon sa langue
router.get("/getUserLessons/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. Récupérer la langue de l'utilisateur
    const [user] = await dbQuery("SELECT id_langue FROM users WHERE id = ?", [userId]);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const langueId = user.id_langue || 0; // par défaut 0

    // 2. Sélectionner la bonne table en fonction de la langue
    const tableName = `user_lessons${langueId > 0 ? langueId : ""}`;

    // 3. Récupérer les leçons depuis la table correspondante
    const lessons = await dbQuery(
      `SELECT lesson_number, status, completed FROM ${tableName} WHERE user_id = ? ORDER BY lesson_number ASC`,
      [userId]
    );

    res.json(lessons);
  } catch (error) {
    console.error("Erreur récupération leçons:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// ✅ Valider une leçon (incrémenter progression)
router.post("/validate", async (req, res) => {
  const { userId, lessonNumber } = req.body;

  if (!userId || lessonNumber == null) {
    return res.status(400).json({ message: "Champs requis manquants." });
  }

  try {
    // 1. Récupérer la langue de l'utilisateur
    const [user] = await dbQuery("SELECT id_langue FROM users WHERE id = ?", [userId]);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const langueId = user.id_langue || 0;
    const tableName = `user_lessons${langueId > 0 ? langueId : ""}`;

    // 2. Marquer la leçon comme complétée
    await dbQuery(
      `UPDATE ${tableName} SET status = ?, completed = ? WHERE user_id = ? AND lesson_number = ?`,
      ["done", true, userId, lessonNumber]
    );

    res.json({ message: "Leçon validée avec succès." });
  } catch (error) {
    console.error("Erreur validation leçon:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
