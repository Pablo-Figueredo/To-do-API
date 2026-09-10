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

Inicialmente, as tarefas serão armazenadas em memória. O banco de dados será implementado posteriormente.

Sobre o Front-end

O front-end presente neste projeto foi desenvolvido com auxílio de IA e tem apenas o objetivo de proporcionar uma visão visual da aplicação e facilitar a demonstração do funcionamento da API.

O foco principal deste projeto é o desenvolvimento do Back-end, especialmente a criação da API, implementação das rotas, lógica do CRUD e, posteriormente, integração com banco de dados.

O front-end não representa o foco principal do projeto.

versão 0.3 — Refatoração do código

Refatorar o código para uma melhor organização:

* [x] Separação do código em rotas, controller e model
* [x] Criação do `TarefaController` para organizar as ações das rotas
* [x] Criação do model `Tarefa` com as operações de criar, listar, atualizar e remover tarefas

O projeto continua utilizando armazenamento em memória. Os dados são perdidos quando o servidor é reiniciado.
