const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  let token;

  // Récupérer le token du header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Non autorisé, aucun token fourni" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Stocker l'id utilisateur dans req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};
