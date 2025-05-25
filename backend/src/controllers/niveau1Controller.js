// 📁 src/controllers/niveau1Controller.js
const db = require('../config/db');

// ✅ Tables de progression par langue
const PROGRESS_TABLES = {
  0: 'niveau1_progress',
  1: 'niveau1_progress1',
  2: 'niveau1_progress2',
};

// ✅ Obtenir la progression actuelle d’un utilisateur
exports.getProgress = (req, res) => {
  const { userId, langue } = req.params;

  if (!userId || langue === undefined) {
    return res.status(400).json({ message: "ID utilisateur et langue requis." });
  }

  const table = PROGRESS_TABLES[langue];
  if (!table) {
    return res.status(400).json({ message: "Langue invalide." });
  }

  const sql = `SELECT avancer FROM ${table} WHERE user_id = ?`;
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur serveur" });
    if (result.length === 0) return res.json({ avancer: 1 }); // par défaut
    res.json(result[0]);
  });
};

// ✅ Incrémenter la progression de l’utilisateur
exports.advanceProgress = (req, res) => {
  const { userId, langue } = req.body;

  if (!userId || langue === undefined) {
    return res.status(400).json({ message: "Données incomplètes." });
  }

  const table = PROGRESS_TABLES[langue];
  if (!table) {
    return res.status(400).json({ message: "Langue invalide." });
  }

  const sql = `
    INSERT INTO ${table} (user_id, avancer)
    VALUES (?, 1)
    ON DUPLICATE KEY UPDATE avancer = IF(avancer < 3, avancer + 1, 3)
  `;

  db.query(sql, [userId], (err) => {
    if (err) {
      console.error("Erreur progression:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    res.json({ message: "Progression mise à jour" });
  });
};
