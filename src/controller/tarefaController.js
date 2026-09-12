import Tarefa from "../model/tarefa.js";
import NaoEncontrado from "../erros/NaoEncontrado.js";

class TarefaController {
  static listarTarefas = async (req, res, next) => {
    try {
      const tarefas = await Tarefa.find();
      res.resultado(tarefas);
      next();
    } catch (erro) {
      next(new NaoEncontrado(erro.message));
    }
  };

  static async listarTarefasPorId(req, res, next) {
    try {
      const tarefas = await Tarefa.findById();
      if (tarefas !== null) {
        res.resultado(tarefas);
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
      const novaTarefa = await Tarefa.create({ titulo });
      if (novaTarefa !== null) {
        res.resultado(novaTarefa);
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
      const tarefaAtualizada = await Tarefa.findByIdAndUpdate(
        id,
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
      const tarefa = await Tarefa.findByIdAndDelete(id);
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