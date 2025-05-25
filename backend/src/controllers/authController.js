const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ✅ REGISTER
exports.register = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur." });
    if (results.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: "Erreur serveur." });

      db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ message: "Erreur serveur." });

          const newUserId = result.insertId;

          // 🔄 Liste des tables multiples à initialiser pour chaque langue
          const themeTables = ["theme0", "theme1", "theme2"];
          const lessonTables = ["user_lessons", "user_lessons1", "user_lessons2"];
          const statsTables = ["user_stats", "user_stats1", "user_stats2"];

          // ➕ Fonction pour initialiser tous les tableaux liés à une langue
          const initUserProgress = async () => {
            try {
              for (let i = 0; i < themeTables.length; i++) {
                const themeQuery = `INSERT INTO ${themeTables[i]} (user_id, avancer) VALUES (?, 1)`;
                await new Promise((resolve, reject) => {
                  db.query(themeQuery, [newUserId], (err) => {
                    if (err) return reject(err);
                    resolve();
                  });
                });

                const lessonQuery = `
                  INSERT INTO ${lessonTables[i]} (user_id, lesson_number, status, completed)
                  VALUES (?, 1, 'unlocked', 0)
                `;
                await new Promise((resolve, reject) => {
                  db.query(lessonQuery, [newUserId], (err) => {
                    if (err) return reject(err);
                    resolve();
                  });
                });

                const statsQuery = `
                  INSERT INTO ${statsTables[i]} (user_id, cauris, crevettes)
                  VALUES (?, 5, 0)
                `;
                await new Promise((resolve, reject) => {
                  db.query(statsQuery, [newUserId], (err) => {
                    if (err) return reject(err);
                    resolve();
                  });
                });
              }

              console.log("✅ Utilisateur initialisé sur les 3 langues.");
              res.status(201).json({
                message:
                  "Utilisateur créé avec succès. Progression, leçons et stats initialisées pour les 3 langues.",
              });
            } catch (initErr) {
              console.error("Erreur d'initialisation multi-langue :", initErr);
              return res.status(500).json({ message: "Erreur serveur lors de l'initialisation." });
            }
          };

          // Démarrer l'initialisation
          initUserProgress();
        }
      );
    });
  });
};

// ✅ LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur." });
    if (results.length === 0) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: "Erreur serveur." });
      if (!isMatch) return res.status(401).json({ message: "Email ou mot de passe incorrect." });

      const token = generateToken(user.id);

      res.json({
        message: "Connexion réussie",
        user: { id: user.id, username: user.username, email: user.email },
        token: token,
      });
    });
  });
};
