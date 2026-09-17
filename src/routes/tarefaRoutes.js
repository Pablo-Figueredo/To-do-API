import express from "express";
import TarefaController from "../controller/tarefaController.js";
import autenticacao from "../middleware/autenticacao.js";

const routes = express.Router();

routes.get("/tarefa", autenticacao, TarefaController.listarTarefas);
routes.post("/tarefa", autenticacao, TarefaController.criarTarefa);
routes.put("/tarefa/:id", autenticacao, TarefaController.atualizarTarefa);
routes.delete("/tarefa/:id", autenticacao, TarefaController.deletarTarefa);

export default routes;