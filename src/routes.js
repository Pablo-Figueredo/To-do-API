import db from './config/db.js';

const routes = (app) => {
   app.get('/tarefa', (req, res) => {
      res.json(db);
   });

   app.post('/tarefa', (req, res) => {
      const tarefa = {
         id: db.length + 1,
         titulo: req.body.titulo,
         concluida: false,
      };

      db.push(tarefa);
      res.status(201).json(tarefa).send({messagem: 'Tarefa criada com sucesso'});
   });

   app.put('/tarefa/:id', (req, res) => {
      const tarefa = db.find((item) => item.id === Number(req.params.id));

      if (!tarefa) {
         return res.status(404).json({ erro: 'Tarefa não encontrada' });
      }

      tarefa.titulo = req.body.titulo ?? tarefa.titulo;
      tarefa.concluida = req.body.concluida ?? tarefa.concluida;
      res.status(200).json(tarefa).send({messagem: 'Tarefa atualizada com sucesso'});
   });

   app.delete('/tarefa/:id', (req, res) => {
      const indice = db.findIndex((item) => item.id === Number(req.params.id));

      if (indice === -1) {
         return res.status(404).json({ erro: 'Tarefa não encontrada' });
      }

      const [tarefa] = db.splice(indice, 1);
      res.status(200).json(tarefa).send({messagem: 'Tarefa removida com sucesso'});
   });

};

export default routes;