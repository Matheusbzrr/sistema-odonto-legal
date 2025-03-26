const express = require("express");
const cors = require("cors");
const app = express();

// rotas
const userRoutes = require("./src/routes/userRoute");
const caseRoutes = require("./src/routes/caseRoute");

const corsOptions = {
  origin: "http://127.0.0.1:5501",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

// rotas da API
app.use("/api", userRoutes);
app.use("/api", caseRoutes);

app.get("/home", (req, res) => {
  res.status(200).json({ msg: "Bem-vindo à API!" });
});

module.exports = app;
