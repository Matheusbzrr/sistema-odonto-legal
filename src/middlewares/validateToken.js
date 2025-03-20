const jwt = require("jsonwebtoken");

module.exports = (requiredRole) => (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret); // decodifica o token

    req.userId = decoded.id; // adiciona o ID ao request
    req.userRole = decoded.role; // adiciona o role ao request

    // verifica se o usuário tem a role necessária para acessar a rota
    if (requiredRole && req.userRole !== requiredRole) {
      return res.status(403).json({ msg: "Acesso negado! Permissão insuficiente." });
    }

    next();
  } catch (err) {
    res.status(400).json({ msg: "Token inválido!" });
  }
};