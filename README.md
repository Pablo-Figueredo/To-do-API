 API de Lista de Tarefas

Projeto de uma API REST para gerenciamento de tarefas, desenvolvido com Node.js e Express.

 Desenvolvimento

 Versão 0.1 — Estrutura inicial

* [x] Inicialização do projeto
* [x] Configuração do Express
* [x] Criação do servidor
* [x] Criação das rotas do CRUD

 Versão 0.2 — Funcionalidades

Implementar as funcionalidades das rotas criadas:

* [x] Adicionar tarefas
* [x] Listar/visualizar tarefas
* [x] Atualizar tarefas
* [x] Deletar tarefas

versão 0.3 — Refatoração do código

Refatorar o código para uma melhor organização:

* [x] Separação do código em rotas, controller e model
* [x] Criação do `TarefaController` para organizar as ações das rotas
* [x] Criação do model `Tarefa` com as operações de criar, listar, atualizar e remover tarefas

Versão 0.4 — Integração com banco de dados

* [x] Instalação do MongoDB e do Mongoose
* [x] Configuração da variável de ambiente para a conexão com o banco
* [x] Criação do arquivo de conexão com o MongoDB
* [x] Alteração do model `Tarefa` para utilizar o Mongoose
* [x] Atualização do controller para salvar e consultar tarefas no banco
* [x] Persistência das tarefas mesmo após reiniciar o servidor

Versão 0.5 — Padronização do tratamento de erros

* [x] Correção dos imports e nomes das classes de erro para manter a estrutura consistente
* [x] Ajuste do middleware de erros para responder corretamente a validações, requisições inválidas e casos de não encontrado
* [x] Centralização da base dos erros em `ErroBase` para padronizar as respostas da API
* [x] Correção da variável do catch no controller para garantir que a mensagem da exceção seja tratada corretamente

Com esses ajustes, a API passou a responder de forma mais consistente quando ocorrem erros de validação, requisição ou ausência de recurso, mantendo o comportamento esperado para o CRUD de tarefas.

Para proteger os dados de conexão, a aplicação utiliza um arquivo `.env` com a variável `STRING_CONEXAO_DB`:

```env
STRING_CONEXAO_DB=sua_string_de_conexao
```

A conexão é feita pelo arquivo `src/config/dbConnect.js`. O Mongoose é responsável por criar, consultar, atualizar e remover os documentos da coleção de tarefas.

O model `Tarefa` define os campos `titulo` e `concluida`. O campo `titulo` é obrigatório e `concluida` começa como `false` por padrão.

As rotas continuam seguindo o CRUD da API:

* `POST /tarefa` — cria e salva uma tarefa
* `GET /tarefa` — lista as tarefas salvas
* `PUT /tarefa/:id` — atualiza uma tarefa pelo seu identificador
* `DELETE /tarefa/:id` — remove uma tarefa pelo seu identificador

Agora os dados não ficam mais apenas na memória da aplicação. Eles são armazenados no MongoDB e continuam disponíveis depois que o servidor é reiniciado.
