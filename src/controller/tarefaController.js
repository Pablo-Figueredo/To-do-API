import Tarefa from "../model/tarefa.js";

class TarefaController {
    
    static listarTarefas(req, res) {
        const tarefas = Tarefa.listar();
        res.status(200).json(tarefas);
    }

    static async criarTarefa(req, res) {
        try {
            const { titulo } = req.body;
            const novaTarefa = Tarefa.criar(titulo);
            res.status(201).json(novaTarefa);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async atualizarTarefa(req, res) {
        try {
            const { id } = req.params;
            const { titulo, concluida } = req.body;
            const tarefaAtualizada = Tarefa.atualizar(id, { titulo, concluida });
            res.status(200).json(tarefaAtualizada);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
    static async deletarTarefa(req, res) {
        try {
            const { id } = req.params;
            Tarefa.remover(id);
            res.status(200).json({ message: "Tarefa deletada com sucesso" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default TarefaController;