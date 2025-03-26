const mongoose = require ("mongoose");

//esquema para localização com latitude e longitude 
const LocationSchema = new mongoose.Schema({
    latitude: { type: String},
    longitude: { type: String}
});

// esquema para o caso 
const caseSchema = new mongoose.Schema({
    nic: { type: String, required: true, unique: true }, 
    title: { type: String, required: true },
    status: {
        type: String,
        enum: ["PENDENTE", "FINALIZADO"],
        default: "PENDENTE",
        required: true
    },
    openedAt: { type: Date, default: Date.now},
    closedAt: { type: Date},
    inquiryNumber: { type: String, required: true, unique: true },
    role: {type: String, required: true},
    caseType: {type: String},
    observations: {type: String},
    location: LocationSchema,
},
 {timestamps: true}
);

module.exports = mongoose.model("Case", caseSchema)