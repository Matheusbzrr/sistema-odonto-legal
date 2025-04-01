const mongoose = require ("mongoose");

//esquema para localização com latitude e longitude 
const LocationSchema = new mongoose.Schema({
    // endereço
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
    inquiryNumber: { type: String, unique: true },
    BO: {type: String, unique: true},
    caseType: {type: String},
    observations: {type: String},
    location: LocationSchema,
    quemAbriuOCaso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    envolvidos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"  // adicionando referência ao modelo User para relacionar com a pessoa envolvida no caso
    }],
    evidence: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evidence"  // adicionando referência ao modelo Evidence para relacionar com a evidencia do caso
    }]  // adicionando referência ao modelo User para relacionar com a pessoa que criou o caso  

    // avaliar colocar os ids de evidencias como lista

},
 {timestamps: true}
);

// filtros data, status, responsavel

module.exports = mongoose.model("Case", caseSchema)