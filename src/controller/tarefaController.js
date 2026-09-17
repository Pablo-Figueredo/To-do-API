import { Tarefa } from "../model/index.js";
import NaoEncontrado from "../erros/NaoEncontrado.js";

class TarefaController {
  static listarTarefas = async (req, res, next) => {
    try {
      const tarefas = await Tarefa.find({ user: req.usuario.id });
      res.status(200).json(tarefas);
    } catch (erro) {
      next(new NaoEncontrado(erro.message));
    }
  };

  static async listarTarefasPorId(req, res, next) {
    try {
      const tarefas = await Tarefa.findOne({ _id: req.params.id, user: req.usuario.id });
      if (tarefas !== null) {
        res.status(200).json(tarefas);
      } else {
        next(new NaoEncontrado("Tarefa não encontrada"));
      }
    } catch (erro) {
      next(erro);
    }
  }

  static async criarTarefa(req, res, next) {
    try {
      const { titulo } = req.body;
      const novaTarefa = await Tarefa.create({ titulo, user: req.usuario.id });
      if (novaTarefa !== null) {
        res.status(201).json(novaTarefa);
      } else {
        next(new NaoEncontrado("Tarefa não criada"));
      }
    } catch (erro) {
      next(erro);
    }
  }

  static async atualizarTarefa(req, res, next) {
    try {
      const id = req.params.id;
      const { titulo, concluida } = req.body;
      const tarefaAtualizada = await Tarefa.findOneAndUpdate(
        { _id: id, user: req.usuario.id },
        { titulo, concluida },
        { new: true }
      );
      if (tarefaAtualizada !== null) {
        res.status(200).json(tarefaAtualizada);
      } else {
        next(new NaoEncontrado("Tarefa não encontrada"));
      }
    } catch (erro) {
      next(erro);
    }
  }

  static async deletarTarefa(req, res, next) {
    try {
      const id = req.params.id;
      const tarefa = await Tarefa.findOneAndDelete({ _id: id, user: req.usuario.id });
      if (tarefa !== null) {
        res.status(200).json({ message: "Tarefa deletada com sucesso" });
      } else {
        next(new NaoEncontrado("Tarefa não encontrada"));
      }
    } catch (erro) {
      next(erro);
    }
  }
}

export default TarefaController;