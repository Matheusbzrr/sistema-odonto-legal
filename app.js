const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./src/routes/userRoute");

const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

// rotas de usuario
app.use("/api", userRoutes);
app.get("/home", (req, res) => {
  res.status(200).json({ msg: "Bem-vindo à API!" });
});

module.exports = app;
