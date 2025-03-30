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
        enum: ["EM ABERTO", "FINALIZADO"],
        default: "EM ABERTO",
        required: true
    },
    openedAt: { type: Date, default: Date.now},
    closedAt: { type: Date},
    inquiryNumber: { type: String, required: true, unique: true },
    caseType: {type: String},
    observations: {type: String},
    location: LocationSchema,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }  // adicionando referência ao modelo User para relacionar com a pessoa que criou o caso  

    // avaliar colocar os ids de evidencias

},
 {timestamps: true}
);

module.exports = mongoose.model("Case", caseSchema)