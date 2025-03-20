import express, { Application } from "express";
import Server from "./src/index";
import dotenv from "dotenv";
import { AppDataSource } from "./src/db/data-source"; // Caminho correto para o banco de dados

dotenv.config();

const app: Application = express();

// 🔥 Inicializa o banco antes do servidor
AppDataSource.initialize()
    .then(() => {
        console.log("🔥 Banco de dados inicializado!");
        new Server(app); // Inicia o servidor somente depois do banco estar pronto

        const PORT: number = parseInt(process.env.PORT || "8080");

        app
            .listen(PORT, () => {
                console.log(`🚀 Servidor rodando na porta ${PORT}`);
            })
            .on("error", (err: any) => {
                if (err.code === "EADDRINUSE") {
                    console.log("❌ Erro: Porta já está em uso");
                } else {
                    console.error(err);
                }
            });
    })
    .catch((error) => {
        console.error("❌ Erro ao iniciar o banco:", error);
    });
