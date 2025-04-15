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
  answers: [
    {
      answer: {
        type: String,
        required: true,
      },
    },
  ],
});


module.exports= mongoose.model("CaseReport", caseReportSchema);
