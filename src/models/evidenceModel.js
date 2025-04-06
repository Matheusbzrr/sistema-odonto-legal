const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    testimony: { type: String },
    descriptionTechnical: { type: String, required: true },
    idCase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    condition: {
      type: String,
      enum: [
        "INTEGRA",
        "ALTERADA",
        "DANIFICADA",
        "CORROMPIDO",
        "CONTAMINADA",
        "APAGADA",
        "VOLATIL",
        "INACESSIVEL",
      ],
      required: true,
    },
    photo: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    obs: { type: String },
    collector: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: {
      type: String,
      enum: [
        "DENTAL",
        "RADIOGRAFICA",
        "FOTOGRAFICA",
        "DOCUMENTAL",
        "BIOLOGICA",
        "LESIONAL",
        "DIGITAL",
      ],
    },
  },
  { timestamps: true }
);

evidenceSchema.pre("save", async function (next) {
  try {
    if (this.idCase) {
      await mongoose.model("Case").findByIdAndUpdate(
        this.idCase,
        { $push: { evidence: this._id } }, 
        { new: true, useFindAndModify: false }
      );
    }
    next(); 
  } catch (error) {
    console.error(error);
    next(new Error("Error in pre save hook of Evidence Schema"));
  }
});

module.exports = mongoose.model("Evidence", evidenceSchema);
