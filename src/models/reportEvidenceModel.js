const mongoose = require("mongoose");

const evidenceReportSchema = new mongoose.Schema(
  {
    evidence: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evidence",

      unique: true,
    },
    note: { type: String },
    descriptionTechnical: { type: String, required: true },
  },
  { timestamps: true }
);

evidenceReportSchema.pre("save", async function (next) {
  try {
    if (this.evidence) {
      await mongoose.model("Evidence").findByIdAndUpdate(
        this.evidence,
        { $set: { reportEvidence: this._id } }, // 👈 Atualiza diretamente o campo único
        { new: true }
      );
    }
    next();
  } catch (error) {
    console.error(error);
    next(new Error("Error in pre save hook of EvidenceReport Schema"));
  }
});

module.exports = mongoose.model("EvidenceReport", evidenceReportSchema);
