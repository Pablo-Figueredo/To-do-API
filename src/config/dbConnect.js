import "dotenv/config";
import mongoose from "mongoose";
import dns from "node:dns";
import Tarefa from "../model/tarefa.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.connect(process.env.STRING_CONEXAO_DB)
  .then(() => Tarefa.syncIndexes())
  .catch((erro) => {
    console.error("Erro ao conectar ao banco de dados:", erro.message);
  });

let db = mongoose.connection;

export default db;