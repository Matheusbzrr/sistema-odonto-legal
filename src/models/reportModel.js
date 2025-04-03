const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    evidence: [{ type: mongoose.Schema.Types.ObjectId, ref: "Evidence" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    case: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    perito: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assistant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //... other fields as needed
    // e.g., priority, type, status, etc.
  },
  { timestamps: true }
);
