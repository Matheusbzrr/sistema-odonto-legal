const jwt = require("jsonwebtoken");

module.exports = (allowedRoles) => (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // verifica se o token não está presente
  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret); // decodifica o token

    req.userId = decoded.id; // adiciona o ID ao request para ser acessado posteriormente
    req.userRole = decoded.role; // adiciona o role ao request para ser acessado posteriormente

    // verifica se o usuário tem a role necessária para acessar a rota
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ msg: "Acesso negado! Permissão insuficiente." });
    }

    next();
  } catch (err) {
    // verifica se o token expirou
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expirado! Faça login novamente." });
    }
    
    res.status(400).json({ msg: "Token inválido!" });
  }
};