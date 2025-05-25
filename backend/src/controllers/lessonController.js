// 📁 src/controllers/lessonController.js
const db = require("../config/db");

// ✅ Tables par langue
const LESSON_TABLES = {
  0: "user_lessons",
  1: "user_lessons1",
  2: "user_lessons2",
};

// ✅ Récupérer les leçons d’un utilisateur pour une langue donnée
exports.getUserProgress = (req, res) => {
  const { userId, langue } = req.params;

  if (!userId || langue === undefined) {
    return res.status(400).json({ message: "ID utilisateur et langue requis." });
  }

  const table = LESSON_TABLES[langue];
  if (!table) {
    return res.status(400).json({ message: "Langue invalide." });
  }

  const sql = `SELECT lesson_number, status, completed FROM ${table} WHERE user_id = ? ORDER BY lesson_number ASC`;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Erreur récupération progression :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    return res.json(results);
  });
};

// ✅ Marquer une leçon comme terminée + débloquer la suivante pour une langue
exports.completeLesson = (req, res) => {
  const { userId, lessonNumber, langue } = req.body;

  if (!userId || !lessonNumber || langue === undefined) {
    return res.status(400).json({ message: "Données incomplètes." });
  }

  const table = LESSON_TABLES[langue];
  if (!table) {
    return res.status(400).json({ message: "Langue invalide." });
  }

  const completeSql = `
    UPDATE ${table} 
    SET completed = 1
    WHERE user_id = ? AND lesson_number = ?
  `;

  const unlockNextLessonSql = `
    INSERT INTO ${table} (user_id, lesson_number, status)
    VALUES (?, ?, 'unlocked')
    ON DUPLICATE KEY UPDATE status = 'unlocked'
  `;

  db.query(completeSql, [userId, lessonNumber], (err) => {
    if (err) {
      console.error("Erreur validation leçon :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    db.query(unlockNextLessonSql, [userId, lessonNumber + 1], (err2) => {
      if (err2) {
        console.error("Erreur déblocage leçon suivante :", err2);
        return res.status(500).json({ message: "Erreur serveur." });
      }

      return res.json({ message: "Leçon complétée et suivante débloquée." });
    });
  });
};

// ✅ Initialiser la première leçon pour une langue donnée
exports.initializeFirstLesson = (userId, langue = 0, callback) => {
  const table = LESSON_TABLES[langue];
  if (!table) {
    console.error("Langue invalide pour initialisation.");
    if (callback) callback(new Error("Langue invalide"));
    return;
  }

  const insertSql = `
    INSERT INTO ${table} (user_id, lesson_number, status, completed)
    VALUES (?, 1, 'unlocked', 0)
  `;
  db.query(insertSql, [userId], (err) => {
    if (err) {
      console.error("Erreur init leçon 1 :", err);
    }
    if (callback) callback(err);
  });
};
