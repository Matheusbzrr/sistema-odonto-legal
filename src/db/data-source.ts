import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export class AppDataSource {
    public static async initialize(): Promise<void> {
        try {
            const mongoURI = process.env.MONGODB_URI as string;

            if (!mongoURI) {
                throw new Error("A variável MONGODB_URI não está definida no .env");
            }

            await mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as mongoose.ConnectOptions);

            console.log("Conectado ao MongoDB!");
        } catch (error) {
            console.error("Erro ao conectar ao MongoDB:", error);
            process.exit(1);
        }
    }
}
