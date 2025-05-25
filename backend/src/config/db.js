const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion MySQL:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connexion MySQL réussie !');
  }
});

module.exports = db;
