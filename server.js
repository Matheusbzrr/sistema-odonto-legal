require("dotenv").config();
const app = require("./app.js");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT;

connectDB();
app.listen(PORT, () => console.log("Servidor rodando"));
