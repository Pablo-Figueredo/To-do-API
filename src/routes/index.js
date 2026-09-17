import express from "express";
import TarefaRoutes from "./tarefaRoutes.js";
import UserRoutes from "./userRoutes.js";

const routes = (app) => {
  app.route('/').get((req, res) => {
    res.status(200).json({ message: "API de Tarefas e Usuários funcionando corretamente!" });
  })
  app.use(
    express.json(),
    TarefaRoutes,
    UserRoutes
  )
}

export default routes