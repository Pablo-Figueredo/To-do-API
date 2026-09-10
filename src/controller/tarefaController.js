import Tarefa from "../model/tarefa.js";

class TarefaController {
    
    static async listarTarefas(req, res) {
        const tarefas = await Tarefa.find();
        res.status(200).json(tarefas);
    }

    static async criarTarefa(req, res) {
        try {
            const { titulo } = req.body;
            const novaTarefa = await Tarefa.create({ titulo });
            res.status(201).json(novaTarefa);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async atualizarTarefa(req, res) {
        try {
            const { id } = req.params;
            const { titulo, concluida } = req.body;
            const tarefaAtualizada = await Tarefa.findByIdAndUpdate(id, { titulo, concluida }, { new: true });
            res.status(200).json(tarefaAtualizada);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
    static async deletarTarefa(req, res) {
        try {
            const { id } = req.params;
            await Tarefa.findByIdAndDelete(id);
            res.status(200).json({ message: "Tarefa deletada com sucesso" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default TarefaController;