# UserControl API

API de estudo para gerenciamento de tarefas associadas a usuarios, com autenticacao, JWT e controle de acesso por roles.

## Como funciona

O fluxo principal e:

```text
Frontend -> API Express -> MongoDB
```

O usuario cria uma conta, faz login e recebe um token JWT. Esse token identifica quem esta fazendo cada requisicao. As tarefas sao vinculadas ao ID do usuario autenticado, por isso cada pessoa acessa somente as proprias tarefas.

As senhas sao armazenadas com bcrypt e nunca sao devolvidas nas respostas da API.

## Usuarios e roles

Cada usuario possui um `role`:

- `user`: pode criar, listar, atualizar e excluir somente as proprias tarefas.
- `admin`: pode acessar a area administrativa e gerenciar usuarios.

Novos usuarios sempre entram como `user`. O acesso administrativo e controlado no backend por middleware, e nao apenas pela interface. O frontend usa o role para mostrar ou esconder a aba de administracao, mas a protecao real esta nas rotas da API.

## Autenticacao

O cadastro acontece em:

```http
POST /user
```

O login acontece em:

```http
POST /user/login
```

Depois do login, o frontend envia o token nas requisicoes protegidas:

```http
Authorization: Bearer <token>
```

O backend valida o token, identifica o usuario e aplica as permissoes correspondentes.

## Tarefas

As rotas de tarefas exigem autenticacao:

- `GET /tarefa` lista as tarefas do usuario logado.
- `POST /tarefa` cria uma tarefa vinculada ao usuario logado.
- `PUT /tarefa/:id` atualiza uma tarefa propria.
- `DELETE /tarefa/:id` exclui uma tarefa propria.

Mesmo que alguem conheca o ID de uma tarefa, nao consegue alterar ou excluir uma tarefa pertencente a outro usuario.

## Administracao

As rotas de gerenciamento de usuarios exigem `role: "admin"`:

- `GET /user` lista usuarios sem expor senhas.
- `GET /user/:id` consulta um usuario.
- `PUT /user/:id` atualiza um usuario.
- `DELETE /user/:id` remove um usuario.

Usuarios comuns recebem resposta `403` ao tentar acessar essas rotas.

## Demonstracao offline

O frontend possui um modo de demonstracao que nao depende da API nem do MongoDB. Ao escolher **Ver demonstracao**, tarefas e usuarios ficticios sao carregados e as alteracoes ficam salvas no `localStorage` do navegador.

Esse modo existe apenas para apresentar a interface no GitHub. Ele nao representa uma autenticacao real e nao compartilha dados com o banco ou com outros usuarios.

## Seguranca

Credenciais do MongoDB e o segredo JWT ficam no backend, em variaveis de ambiente, e nao devem ser publicados no frontend ou no GitHub.
