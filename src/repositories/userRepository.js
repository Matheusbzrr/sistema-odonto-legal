const User = require("../models/userModel");

// cria usuario
const create = async (data) => {
  const user = new User(data);
  return await user.save();
};

const getAllUsers = async (data) => {
  const users = await User.find(data).select("-password");
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

// busca todos usuarios a partir do status passado
const getUsersStatus = async (offSet, limit, data) => {
  return await User.find({ status: data })
    .skip(offSet)
    .limit(limit)
    .select("-password");
};

const updateStatus = async (id, newStatus, identification) => {
  const updateStatusUser = await User.findByIdAndUpdate(
    id,
    { status: newStatus, responseBy: identification },
    { new: true }
  );
  return updateStatusUser;
};

const updatePassword = async (
  id,
  newPassword,
  newSolicitation,
  newStatus,
  newResponseBy
) => {
  const updatePasswordUser = await User.findByIdAndUpdate(
    id,
    {
      password: newPassword,
      solicitationTitle: newSolicitation,
      status: newStatus,
      responseBy: newResponseBy,
    },
    { new: true }
  );
  return updatePasswordUser;
};

const updatePasswordInSystem = async (id, newPassword) => {
  return await User.findByIdAndUpdate(id, { password: newPassword });
};

const updatePasswordByAdmin = async (_id, passwordHash, responseBy) => {
  return await User.findByIdAndUpdate(_id, {
    password: passwordHash,
    status: "APROVADO",
    solicitationTitle: `Última solicitação: usuário teve recuperação de senha negada, então admin ${responseBy} alterou direto no sistema.`,
    responseBy: responseBy,
  });
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

const deleteUser = async (id) => {
  await User.findByIdAndDelete(id);
};

module.exports = {
  create,
  getUserByCpf,
  getUserById,
  getUserByEmail,
  getUsersStatus,
  updateStatus,
  updatePassword,
  updatePasswordInSystem,
  updatePasswordByAdmin,
  updateProfile,
  updateUserAddress,
  deleteUser,
};
