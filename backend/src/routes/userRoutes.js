const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const util = require('util');
const dbQuery = util.promisify(db.query).bind(db);

// -----------------------------
// 🔐 Middleware d'authentification
// -----------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Token manquant" });

  jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY", (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    req.user = user;
    next();
  });
}


// -----------------------------
// 👤 Voir son profil
// -----------------------------
router.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const results = await dbQuery('SELECT id, username, email, id_langue FROM users WHERE id = ?', [userId]);
    if (results.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// -----------------------------
// ✏️ Modifier son profil
// -----------------------------
router.put('/update', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { username } = req.body;

  if (!username) return res.status(400).json({ message: "Nouveau username requis" });

  try {
    await dbQuery('UPDATE users SET username = ? WHERE id = ?', [username, userId]);
    res.json({ message: "Profil mis à jour avec succès !" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// -----------------------------
// 📊 Obtenir les stats
// -----------------------------
router.get('/stats/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const results = await dbQuery('SELECT cauris, crevettes FROM user_stats WHERE user_id = ?', [userId]);
    if (results.length === 0) return res.status(404).json({ message: "Statistiques non trouvées" });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// -----------------------------
// ➖ Enlever 1 cauri
// -----------------------------
router.get('/remove-cauri/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    await dbQuery('UPDATE user_stats SET cauris = GREATEST(cauris - 1, 0) WHERE user_id = ?', [userId]);
    const results = await dbQuery('SELECT cauris FROM user_stats WHERE user_id = ?', [userId]);
    if (results.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ newCauris: results[0].cauris });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// -----------------------------
// ✅ Ajouter 1 cauri
// -----------------------------
router.get('/add-cauri/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    await dbQuery('UPDATE user_stats SET cauris = LEAST(cauris + 1, 5) WHERE user_id = ?', [userId]);
    const results = await dbQuery('SELECT cauris FROM user_stats WHERE user_id = ?', [userId]);
    if (results.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ newCauris: results[0].cauris });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// -----------------------------
// ✅ Mettre à jour le temps + XP
// -----------------------------
router.post("/update-xp-time", async (req, res) => {
  const { userId, exerciseNumber, time, xp } = req.body;

  if (!userId || !exerciseNumber || time == null || xp == null) {
    return res.status(400).json({ message: "Champs requis manquants." });
  }

  if (exerciseNumber < 1 || exerciseNumber > 12) {
    return res.status(400).json({ message: "Numéro d'exercice invalide." });
  }

  const timeColumn = `time${exerciseNumber}`;
  try {
    const results = await dbQuery(`SELECT ${timeColumn} FROM user_stats WHERE user_id = ?`, [userId]);

    if (results.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé." });

    const oldTime = results[0][timeColumn];

    if (oldTime == null || time < oldTime) {
      await dbQuery(
        `UPDATE user_stats SET ${timeColumn} = ?, crevettes = crevettes + ? WHERE user_id = ?`,
        [time, xp, userId]
      );
      res.json({ message: "✅ XP ajouté et meilleur temps enregistré." });
    } else {
      res.json({ message: "⏱️ Temps plus long. XP non ajouté." });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// -----------------------------
// 📊 Top 20 + utilisateur connecté
// -----------------------------
router.get('/top20-with-user/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const topResults = await dbQuery(`
      SELECT u.id, u.username, s.crevettes 
      FROM users u
      JOIN user_stats s ON u.id = s.user_id
      ORDER BY s.crevettes DESC
      LIMIT 20
    `);

    const userInTop = topResults.find(u => u.id === userId);
    if (userInTop) {
      return res.json(topResults);
    } else {
      const userResults = await dbQuery(`
        SELECT u.id, u.username, s.crevettes 
        FROM users u
        JOIN user_stats s ON u.id = s.user_id
        WHERE u.id = ?
      `, [userId]);

      if (userResults.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });

      const combined = [...topResults, userResults[0]];
      return res.json(combined);
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// -----------------------------
// ✅ Enregistrer la langue choisie
// -----------------------------
router.patch("/set-language/:id", async (req, res) => {
  const { langueId } = req.body;
  const userId = req.params.id;

  try {
    await dbQuery("UPDATE users SET id_langue = ? WHERE id = ?", [langueId, userId]);
    res.json({ message: "Langue mise à jour avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// -----------------------------
// ✅ Marquer la vidéo comme vue
// -----------------------------
router.patch("/set-video-viewed/:userId", async (req, res) => {
  const { userId } = req.params;
  const { langueId } = req.body;

  try {
    const rows = await dbQuery(
      "SELECT * FROM user_video_views WHERE user_id = ? AND langue_id = ?",
      [userId, langueId]
    );

    if (rows.length === 0) {
      await dbQuery(
        "INSERT INTO user_video_views (user_id, langue_id, viewed, viewed_at) VALUES (?, ?, ?, NOW())",
        [userId, langueId, true]
      );
    } else {
      await dbQuery(
        "UPDATE user_video_views SET viewed = ?, viewed_at = NOW() WHERE user_id = ? AND langue_id = ?",
        [true, userId, langueId]
      );
    }

    res.status(200).json({ message: "Vue enregistrée." });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// -----------------------------
// 🔍 Vérifier si la vidéo est vue
// -----------------------------
router.get('/user/video-viewed/:userId/:langueId', async (req, res) => {
  const { userId, langueId } = req.params;

  try {
    const results = await dbQuery(
      'SELECT viewed FROM user_video_views WHERE user_id = ? AND langue_id = ?',
      [userId, langueId]
    );
    if (results.length === 0) return res.json({ viewed: false });
    return res.json({ viewed: results[0].viewed });
  } catch (err) {
    res.status(500).json({ viewed: false });
  }
});


router.get("/video-viewed/:userId/:langueId", async (req, res) => {
  const { userId, langueId } = req.params;

  try {
    const results = await dbQuery(
      "SELECT viewed FROM user_video_views WHERE user_id = ? AND langue_id = ?",
      [userId, langueId]
    );

    const viewed = results.length > 0 && results[0].viewed === 1;
    res.json({ viewed });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
});
router.patch("/set-video-viewed/:userId", async (req, res) => {
  const { userId } = req.params;
  const { langueId } = req.body;

  if (!langueId) {
    return res.status(400).json({ message: "ID de langue manquant" });
  }

  try {
    // Insertion ou mise à jour
    await dbQuery(`
      INSERT INTO user_video_views (user_id, langue_id, viewed)
      VALUES (?, ?, true)
      ON DUPLICATE KEY UPDATE viewed = true, viewed_at = CURRENT_TIMESTAMP
    `, [userId, langueId]);

    res.json({ message: "Vidéo marquée comme vue" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
});


module.exports = router;
