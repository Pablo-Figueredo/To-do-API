const routes = (app) => {
 app.get("/tarefa", (req, res) => {
    res.send("rota de tarefas")
  });

  app.post("/tarefa", (req, res) => {
    res.send("rota de criação de tarefas")
  });   

app.put("/tarefa", (req, res) => {
   res.send("rota de atualização de tarefas")
})

app.delete("/tarefa", (req, res) => {
   res.send("rota de exclusão de tarefas")
})  

};

export default routes;