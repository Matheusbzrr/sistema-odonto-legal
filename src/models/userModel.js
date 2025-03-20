const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    numberHouse: { type: Number, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    cep: { type: String, required: true },
    complement: { type: String },
  },
  { timestamps: true }
); // registra datas de criação/modificação

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["ADMIN", "PERITO", "ASSISTENTE"],
    },
    cpf: { type: String, required: true, unique: true },
    dateOfBirth: { type: String, required: true },
    address: AddressSchema,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
