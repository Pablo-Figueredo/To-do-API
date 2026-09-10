import db from '../config/db.js';

const Tarefa = {
  criar(titulo) {
    const tarefa = {
      id: db.length + 1,
      titulo,
      concluida: false
    };

    db.push(tarefa);
    return tarefa;
  },

  listar() {
    return db;
  },

  atualizar(id, dados) {
    const tarefa = db.find((item) => item.id === Number(id));

    if (!tarefa) {
      throw new Error('Tarefa não encontrada');
    }

    Object.assign(tarefa, dados);

    return tarefa;
  },

  remover(id) {
    const indice = db.findIndex((item) => item.id === Number(id));

    if (indice === -1) {
      throw new Error('Tarefa não encontrada');
    }

    db.splice(indice, 1);
  }
};

export default Tarefa;

