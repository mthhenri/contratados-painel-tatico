# Requirement 001 - Painel Tático do Mestre

## Objetivo

Desenvolver uma aplicação web chamada **Contratados: Painel Tático**, destinada a auxiliar mestres de Contratados RPG no gerenciamento de combates e encontros.

A primeira versão do sistema deve focar exclusivamente na experiência do mestre, permitindo controlar o estado do combate de forma rápida e organizada.

---

## Escopo

O sistema deverá permitir que um mestre autenticado:

* Acesse seu painel de controle;
* Crie e gerencie sessões de combate;
* Adicione e remova participantes;
* Controle a ordem de iniciativa;
* Atualize atributos importantes dos participantes;
* Gerencie condições e estados temporários;
* Acompanhe o progresso do combate.

---

## Usuários

### Mestre

O mestre é o único tipo de usuário suportado na primeira versão do sistema.

Ele possui acesso total às funcionalidades do Painel Tático.

A arquitetura deve permitir a adição futura de jogadores sem necessidade de grandes mudanças estruturais.

---

## Fora do escopo

Nesta primeira versão, não serão implementados:

* Acesso de jogadores;
* Cadastro público;
* Chat;
* Rolagem de dados;
* Automação das regras do RPG;
* Fichas completas;
* Multiplayer em tempo real;
* Compartilhamento de sessões;
* Login social;
* Aplicativo mobile.

---

## Critérios de aceite

* [ ] O mestre consegue acessar o sistema.
* [ ] O mestre consegue criar uma sessão de combate.
* [ ] O mestre consegue adicionar participantes.
* [ ] O mestre consegue controlar a iniciativa.
* [ ] O mestre consegue alterar os estados dos participantes durante o combate.
* [ ] O sistema mantém as informações persistidas.

---

## Restrições técnicas

### Frontend

* Angular (última versão estável);
* TypeScript;
* PrimeNG;
* Standalone Components;
* Angular Signals.

### Backend

* NestJS;
* TypeScript;
* Prisma ORM;
* PostgreSQL;
* JWT para autenticação.

### Infraestrutura

* Docker;
* Docker Compose;
* API REST;
* Swagger.

---

## Arquitetura

O sistema deve ser desenvolvido de forma modular.

As funcionalidades deverão ser implementadas como features independentes.

Exemplos de futuras features:

* Autenticação;
* Dashboard;
* Sessões de combate;
* Participantes;
* Iniciativa;
* Condições;
* Histórico;
* Multiplayer.

---

## Princípios do projeto

* O estado do combate é a entidade central do sistema.
* O sistema deve priorizar simplicidade e rapidez de uso durante a sessão.
* Novas funcionalidades devem poder ser adicionadas sem grandes refatorações.
* A experiência do mestre tem prioridade na primeira versão do produto.
