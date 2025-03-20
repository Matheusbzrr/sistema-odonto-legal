const User = require("../models/userModel");

// busca usuario por email 
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};


// busca usuario por id sem mostrar a senha. pode ser trocado para consulta com cpf posteriormente ou inverter com email
const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};

// cria usuario
const Create = async (data) => {
  const user = new User(data);
  return await user.save();
};

module.exports = { getUserByEmail, getUserById, Create };
