const mongoose = require("mongoose");

const dentalHistorySchema = new mongoose.Schema(
  {
    examType: {
      type: String,
      enum: [
        "CLÍNICO",
        "RADIOGRÁFICO",
        "FOTOGRÁFICO",
        "DOCUMENTAL",
        "MOLECULAR",
        "TOXICOLÓGICO",
        "LESIONAL",
        "DIGITAL",
        "PALATOSCÓPICO",
        "ANTROPOSCÓPICO",
        "ODONTOSCOPIA",
      ],
    },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    toothCharting: { type: Object },
    photo: { type: String },
    idPatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    examiner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    injuryDetails: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DentalHistory", dentalHistorySchema);
