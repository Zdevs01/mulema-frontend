// 📁 src/routes/niveau1Routes.js
const express = require("express");
const router = express.Router();
const niveau1Controller = require("../controllers/niveau1Controller");

router.get("/get/:userId", niveau1Controller.getProgress);
router.post("/advance", niveau1Controller.advanceProgress);

module.exports = router;
