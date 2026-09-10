import express from "express";
import TarefaController from "./controller/tarefaController.js";

const routes = express.Router();

routes.get("/tarefa", TarefaController.listarTarefas);
routes.post("/tarefa", TarefaController.criarTarefa);
routes.put("/tarefa/:id", TarefaController.atualizarTarefa);
routes.delete("/tarefa/:id", TarefaController.deletarTarefa);

export default routes;