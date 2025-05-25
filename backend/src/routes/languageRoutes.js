const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    const query = "SELECT id, nom, description, video_intro, vue, actus FROM language";
  
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ message: "Erreur serveur", err });
  
      const host = "http://172.20.10.3:5000"; // Remplace par ton IP locale visible sur ton réseau
      const updatedResults = results.map(langue => {
        return {
          ...langue,
          video_intro: langue.video_intro
            ? `${host}/videos/${langue.video_intro}`
            : null,
        };
      });
  
      res.json(updatedResults);
    });
  });
  

module.exports = router;
