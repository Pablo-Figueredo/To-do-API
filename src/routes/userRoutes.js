import express from "express";
import UserController from "../controller/userController.js";
import autenticacao from "../middleware/autenticacao.js";
import apenasAdmin from "../middleware/apenasAdmin.js";

const routes = express.Router();

routes.post("/user/login", UserController.login);
routes.post("/user", UserController.criarUser);
routes.get("/user", autenticacao, apenasAdmin, UserController.listarusers);
routes.get("/user/:id", autenticacao, apenasAdmin, UserController.listarUsersPorId);
routes.put("/user/:id", autenticacao, apenasAdmin, UserController.atualizarUser);
routes.delete("/user/:id", autenticacao, apenasAdmin, UserController.deletarUser);

export default routes;  