const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  street: { type: String },
  houseNumber: { type: Number },
  district: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  complement: { type: String },
});

const patientSchema = new mongoose.Schema(
  {
    nic: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    cpf: { type: String },
    address: LocationSchema,
    identificationStatus: {
      type: String,
      enum: ["IDENTIFICADO", "NÃO IDENTIFICADO", "PARCIALMENTE IDENTIFICADO"],
    },
    dentalHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "DentalHistory" },
    ],
    idCase: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
