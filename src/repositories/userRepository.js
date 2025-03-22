const User = require("../models/userModel");

// cria usuario
const create = async (data) => {
  const user = new User(data);
  return await user.save();
};

const getUserById = async (data) => {
  return await User.findById(data);
};

// busca usuario por email
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// busca todos usuarios com status aprovado
const getUsersApproved = async (offSet, limit) => {
  return await User.find()
    .where("status")
    .equals("APROVADO")
    .skip(offSet)
    .limit(limit)
    .select("-password");
};

// busca todos usuarios com status pendente
const getUsersPending = async (offSet, limit) => {
  return await User.find()
    .where("status")
    .equals("PENDENTE")
    .skip(offSet)
    .limit(limit)
    .select("-password");
};

// busca todos usuarios com status negado
const getUsersInvalid = async (offSet, limit) => {
  return await User.find()
    .where("status")
    .equals("NEGADO")
    .skip(offSet)
    .limit(limit)
    .select("-password");
};

const updateSatus = async (id, newStatus, identification) => {
  const updateStatusUser = await User.findByIdAndUpdate(
    id,
    { status: newStatus, approvedBy: identification },
    { new: true }
  );
  return updateStatusUser;
};

module.exports = {
  create,
  getUserById,
  getUserByEmail,
  getUsersApproved,
  getUsersPending,
  getUsersInvalid,
  updateSatus,
};
