const User = require("../models/userModel");

// cria usuario
const create = async (data) => {
  const user = new User(data);
  return await user.save();
};

const getAllUsers = async (offSet, limit) => {
  return await User.find({ isActive: true })
    .skip(offSet)
    .limit(limit)
    .select("-password")
    .sort({ createdAt: -1 });
};

const getAllUsersButton = async () => {
  return await User.find({ isActive: true }).select("name role");
};

const getUserByCpf = async (cpf) => {
  return await User.findOne({ cpf });
};

const getUserById = async (data) => {
  return await User.findById(data);
};

// busca usuario por email
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const updateProfile = async (id, newData) => {
  const updateProfileUser = await User.findByIdAndUpdate(id, newData, {
    new: true,
  });
  return updateProfileUser;
};

const updateUserAddress = async (userId, newAddress) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: { address: newAddress } },
    { new: true }
  );
};

module.exports = {
  create,
  getAllUsers,
  getAllUsersButton,
  getUserByCpf,
  getUserById,
  getUserByEmail,
  updateProfile,
  updateUserAddress,
};
