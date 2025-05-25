const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Mets ton mot de passe MySQL ici
  database: "mulemaap_db",
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL:", err);
  } else {
    console.log("Connecté à la base de données MySQL.");
  }
});

module.exports = db;
