const express = require("express");
const cors = require("cors");
const app = express();

// rotas
const patientRoutes = require("./src/routes/patienteRoute");
const userRoutes = require("./src/routes/userRoute");
const caseRoutes = require("./src/routes/caseRoute");
const evidenceRoutes = require("./src/routes/evidenceRoute");
const reportEvidenceRoutes = require("./src/routes/reportEvidenceRoute");
const caseReportEvidenceRoutes = require("./src/routes/caseReportRoute")


const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

// rotas da API
app.use("/api", userRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/report", reportEvidenceRoutes);
app.use("/api/case/report", caseReportEvidenceRoutes)



app.get("/home", (req, res) => {
  res.status(200).json({ msg: "Bem-vindo à API!" });
});

module.exports = app;
