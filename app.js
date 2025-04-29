const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();


// Swagger
const { swaggerUi, swaggerSpec } = require("./src/swagger");

const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(helmet());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json());


// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API
const patientRoutes = require("./src/routes/patienteRoute");
const userRoutes = require("./src/routes/userRoute");
const caseRoutes = require("./src/routes/caseRoute");
const evidenceRoutes = require("./src/routes/evidenceRoute");
const reportEvidenceRoutes = require("./src/routes/reportEvidenceRoute");
const caseReportEvidenceRoutes = require("./src/routes/caseReportRoute");
const dashRoutes = require("./src/routes/dashRoute");

app.use("/api", userRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/report", reportEvidenceRoutes);
app.use("/api/case/report", caseReportEvidenceRoutes);
app.use("/api/dash", dashRoutes);

// Rota simples de teste
app.get("/home", (req, res) => {
  res.status(200).json({ msg: "Bem-vindo à API!" });
});

module.exports = app;
