const mongoose = require("mongoose");

//esquema para localização com latitude e longitude
const LocationSchema = new mongoose.Schema({
  street: { type: String },
  houseNumber: { type: Number },
  district: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  complement: { type: String },
});

// esquema para o caso
const caseSchema = new mongoose.Schema(
  {
    protocol: { type: String, required: true, unique: true },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["ABERTO", "FINALIZADO", "ARQUIVADO"],
      default: "ABERTO",
      required: true,
    },
    openedAt: { type: Date, default: Date.now },
    closedAt: { type: Date },
    inquiryNumber: { type: String },
    BO: { type: String },
    caseType: {
      type: String,
      enum: [
        "ACIDENTE",
        "IDENTIFICAÇÃO DE VÍTIMA",
        "EXAME CRIMINAL",
        "MORDIDA",
        "AVALIAÇÃO DE LESÕES",
        "FRAUDE ODONTOLÓGICA",
        "DIREITOS HUMANOS",
      ],
      required: true,
    },
    observations: { type: String },
    location: LocationSchema,
    openedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    involved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    evidence: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evidence",
      },
    ],
    history: [
      {
        field: { type: String, required: true },
        oldValue: { type: mongoose.Schema.Types.Mixed },
        newValue: { type: mongoose.Schema.Types.Mixed },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

caseSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const caseDoc = await this.model.findOne(this.getQuery());

  if (!caseDoc) return next();

  const fieldsToTrack = [
    "title",
    "status",
    "inquiryNumber",
    "BO",
    "observations",
    "location",
    "involved",
    "evidence",
  ];

  const changes = [];

  fieldsToTrack.forEach((field) => {
    // Pegamos o valor atualizado, seja direto ou dentro de $set
    const newValue =
      update[field] !== undefined ? update[field] : update.$set?.[field];

    if (newValue !== undefined) {
      const oldValue = caseDoc[field];

      // Para objetos e arrays, fazemos uma comparação JSON para detectar mudanças corretamente
      const isDifferent =
        typeof newValue === "object"
          ? JSON.stringify(newValue) !== JSON.stringify(oldValue)
          : String(newValue) !== String(oldValue);

      if (isDifferent) {
        changes.push({
          field,
          oldValue,
          newValue,
          changedBy: update.userId,
          changedAt: new Date(),
        });
      }
    }
  });

  if (changes.length > 0) {
    await this.model.updateOne(this.getQuery(), {
      $push: { history: { $each: changes } },
    });
  }

  next();
});

// filtros data, status, responsavel

module.exports = mongoose.model("Case", caseSchema);
