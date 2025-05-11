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

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
});

// esquema para o caso
const caseSchema = new mongoose.Schema(
  {
    caseReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CaseReport",
    },
    protocol: { type: String, required: true, unique: true },
    patient: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
      },
    ],
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["ABERTO", "FINALIZADO", "ARQUIVADO"],
      default: "ABERTO",
      required: true,
    },
    openedAt: { type: Date, default: Date.now },
    closedAt: { type: Date },
    requestingInstitution: {
      type: String,
    },
    requestingAuthority: {
      type: String,
    },
    inquiryNumber: { type: String },
    questions: [QuestionSchema],
    caseType: {
      type: String,
      enum: [
        "IDENTIFICAÇÃO",
        "AVALIAÇÃO DE LESÕES CORPORAIS",
        "COLETA DE PROVA",
        "PERÍCIA DE RESPONSABILIDADE",
        "EXAME DE VIOLÊNCIA",
        "ANÁLISE MULTIVÍTIMA",
        "OUTROS",
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
    professional: [
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
    "observations",
    "location",
    "professional",
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
