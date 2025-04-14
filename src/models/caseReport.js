const mongoose = require("mongoose");

const caseReportSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  conclusion: {
    type: String,
    required: true,
  },
  responsible: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  answers: [
    {
      answer: {
        type: String,
        required: true,
      },
    },
  ],
});

caseReportSchema.pre("save", async function (next) {
  try {
    if (this.case) {
      await mongoose.model("Case").findByIdAndUpdate(
        this.case,
        { $set: { caseReport: this._id } },
        { new: true}
      );
    }
    next();
  } catch (error) {
    console.error(error);
    next(new Error("Error in pre save hook of CaseReport Schema"));
  }
});


module.exports= mongoose.model("CaseReport", caseReportSchema);
