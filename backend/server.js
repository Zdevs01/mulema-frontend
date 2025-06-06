const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./src/config/db"); // Connexion à MySQL

// ✅ Import des routes
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const lessonRoutes = require("./src/routes/lessonRoutes");
const niveau1Routes = require("./src/routes/niveau1Routes");
const theme0Routes = require("./src/routes/theme0");
const theme2Routes = require("./src/routes/theme2");
const theme1Routes = require("./src/routes/theme1");
const languageRoutes = require("./src/routes/languageRoutes");
const profileRoutes = require("./src/routes/profile");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// ✅ Route d'accueil avec réponse JSON
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l’API Mulema 🎉" });
});

// ✅ Utilisation des routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/niveau1", niveau1Routes);
app.use("/api/theme0", theme0Routes);
app.use("/api/theme1", theme1Routes);
app.use("/api/theme2", theme2Routes);
app.use("/api/languages", languageRoutes);
app.use("/api/profile", profileRoutes);

// ✅ Accès aux fichiers vidéos
app.use("/videos", express.static("videos"));

// ✅ Lancement du serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Serveur API démarré sur http://localhost:${PORT}`);
});
