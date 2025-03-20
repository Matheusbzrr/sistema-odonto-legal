import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import Routes from "./routes/route";

export default class Server {
    constructor(app: Application) {
        this.config(app);
        app.use("/api", Routes); // 🔥 Garante que as rotas são aplicadas corretamente
    }

    private config(app: Application): void {
        const allowedOrigins = ["http://127.0.0.1:5501", "http://localhost:8080"];

        const corsOptions: CorsOptions = {
            origin: function (origin, callback) {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error("Origem não permitida pelo CORS"));
                }
            },
        };

        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
    }
}
