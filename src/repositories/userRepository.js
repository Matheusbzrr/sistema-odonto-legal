const User = require("../models/userModel");

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};

const create = async (data) => {
  const user = new User(data);
  return await user.save();
};

module.exports = { getUserByEmail, getUserById, create };
