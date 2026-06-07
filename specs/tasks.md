# Tasks - Painel Tático do Mestre

## Legenda

- **Arquivos:** lista de arquivos criados ou modificados pela task
- **Pronto quando:** critério objetivo de conclusão

---

## Fase 0 — Infraestrutura e Setup

### [x] T-001 · Docker Compose e variáveis de ambiente

Configurar o ambiente local com os três serviços: banco de dados, backend e frontend.

**Arquivos:**
- `docker-compose.yml`
- `.env.example`

**Pronto quando:**
- `docker compose up` sobe os três serviços sem erro
- PostgreSQL está acessível na porta configurada
- Backend e frontend respondem em suas respectivas portas

---

### [x] T-002 · Scaffold do projeto NestJS

Criar o projeto backend com NestJS, configurar TypeScript e instalar dependências base.

**Arquivos:**
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/nest-cli.json`
- `backend/.env.example`
- `backend/Dockerfile`
- `backend/src/main.ts`
- `backend/src/app.module.ts`

**Pronto quando:**
- `npm run start:dev` inicia o servidor sem erro
- Swagger está acessível em `/api/docs`

---

### [x] T-003 · Scaffold do projeto Angular

Criar o projeto frontend com Angular standalone, instalar PrimeNG e configurar ambientes.

**Arquivos:**
- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/angular.json`
- `frontend/Dockerfile`
- `frontend/src/main.ts`
- `frontend/src/index.html`
- `frontend/src/styles.scss`
- `frontend/src/environments/environment.ts`
- `frontend/src/environments/environment.prod.ts`
- `frontend/src/app/app.config.ts`
- `frontend/src/app/app.routes.ts`

**Pronto quando:**
- `ng serve` abre sem erro no browser
- PrimeNG está importado e um componente primitivo renderiza

---

### [x] T-004 · Prisma: configuração e schema inicial

Configurar o Prisma ORM, definir o schema completo e criar a primeira migration.

**Arquivos:**
- `backend/prisma/schema.prisma`
- `backend/src/prisma/prisma.module.ts`
- `backend/src/prisma/prisma.service.ts`

**Pronto quando:**
- `npx prisma migrate dev` executa sem erro
- Todas as tabelas (`users`, `sessions`, `participants`, `conditions`, `participant_conditions`) são criadas no banco
- `PrismaService` está disponível para injeção no `AppModule`

---

### [x] T-005 · Seed de condições

Popular o catálogo de condições com as 28 condições oficiais do sistema Contratados.

**Arquivos:**
- `backend/prisma/seed.ts`
- `backend/package.json` (script `prisma:seed`)

**Pronto quando:**
- `npx prisma db seed` executa sem erro
- As 28 condições estão na tabela `conditions` com nome e descrição corretos
- Executar o seed duas vezes não duplica registros (upsert)

---

## Fase 1 — Autenticação

### T-006 · Módulo de usuários

Criar o módulo de usuários com serviço de busca por e-mail.

**Arquivos:**
- `backend/src/users/users.module.ts`
- `backend/src/users/users.service.ts`
- `backend/src/users/entities/user.entity.ts`

**Pronto quando:**
- `UsersService.findByEmail(email)` retorna o usuário ou `null`
- O módulo está exportando `UsersService` corretamente

---

### T-007 · Módulo de autenticação (backend)

Implementar login com JWT. Criar guard para proteger rotas autenticadas.

**Arquivos:**
- `backend/src/auth/auth.module.ts`
- `backend/src/auth/auth.controller.ts`
- `backend/src/auth/auth.service.ts`
- `backend/src/auth/auth.guard.ts`
- `backend/src/auth/jwt.strategy.ts`
- `backend/src/auth/dto/login.dto.ts`
- `backend/src/auth/dto/auth-response.dto.ts`

**Pronto quando:**
- `POST /api/auth/login` retorna `{ accessToken, user }` com credenciais válidas
- `POST /api/auth/login` retorna 401 com credenciais inválidas
- Rota protegida com `AuthGuard` retorna 401 sem token e 200 com token válido

---

### T-008 · Autenticação no frontend (serviço e guard)

Implementar `AuthService`, `AuthGuard` e `AuthInterceptor` no Angular.

**Arquivos:**
- `frontend/src/app/core/services/auth.service.ts`
- `frontend/src/app/core/guards/auth.guard.ts`
- `frontend/src/app/core/interceptors/auth.interceptor.ts`

**Pronto quando:**
- `AuthService.login()` chama `POST /api/auth/login` e armazena o token
- `AuthService.logout()` remove o token e redireciona para `/login`
- `AuthInterceptor` injeta `Authorization: Bearer <token>` em todas as requisições
- `AuthGuard` redireciona para `/login` se não houver token
- `AuthGuard` redireciona para `/dashboard` se já autenticado e acessar `/login`

---

### T-009 · Página de login

Criar a tela de login com formulário de e-mail e senha.

**Arquivos:**
- `frontend/src/app/features/auth/auth.routes.ts`
- `frontend/src/app/features/auth/pages/login/login.component.ts`
- `frontend/src/app/features/auth/pages/login/login.component.html`

**Pronto quando:**
- Rota `/login` renderiza o formulário
- Submeter com credenciais válidas redireciona para `/dashboard`
- Submeter com credenciais inválidas exibe mensagem de erro
- Formulário desabilita o botão enquanto a requisição está em andamento

---

## Fase 2 — Sessões de Combate

### T-010 · Módulo de sessões (backend)

Implementar CRUD completo de sessões de combate.

**Arquivos:**
- `backend/src/sessions/sessions.module.ts`
- `backend/src/sessions/sessions.controller.ts`
- `backend/src/sessions/sessions.service.ts`
- `backend/src/sessions/dto/create-session.dto.ts`
- `backend/src/sessions/dto/update-session.dto.ts`
- `backend/src/sessions/dto/session-response.dto.ts`

**Pronto quando:**
- `GET /api/sessions` retorna apenas as sessões do mestre autenticado
- `POST /api/sessions` cria sessão com `status: ACTIVE` e `currentTurn: 0`
- `GET /api/sessions/:id` retorna sessão com array `participants` (com condições aninhadas)
- `PATCH /api/sessions/:id` atualiza `name` e/ou `status`
- `DELETE /api/sessions/:id` remove a sessão
- Todas as rotas retornam 404 se a sessão não pertencer ao mestre autenticado

---

### T-011 · Serviço de sessões (frontend)

Criar o serviço Angular para consumir as rotas de sessões.

**Arquivos:**
- `frontend/src/app/features/sessions/services/sessions.service.ts`

**Pronto quando:**
- `getSessions()` retorna `Observable<Session[]>`
- `getSession(id)` retorna `Observable<SessionDetail>`
- `createSession(name)` retorna `Observable<Session>`
- `updateSession(id, data)` retorna `Observable<Session>`
- `deleteSession(id)` retorna `Observable<void>`

---

### T-012 · Página de listagem de sessões

Exibir a lista de sessões do mestre com opções de criar e abrir.

**Arquivos:**
- `frontend/src/app/features/sessions/sessions.routes.ts`
- `frontend/src/app/features/sessions/pages/session-list/session-list.component.ts`
- `frontend/src/app/features/sessions/pages/session-list/session-list.component.html`

**Pronto quando:**
- Rota `/sessions` exibe a lista de sessões
- Badge de status (ACTIVE / PAUSED / FINISHED) está visível em cada item
- Botão "Nova Sessão" abre dialog para informar o nome e cria a sessão
- Clicar em uma sessão navega para `/sessions/:id`
- Lista recarrega após criar ou deletar uma sessão

---

### T-013 · Layout principal e dashboard

Criar o componente de layout com navegação lateral e a página de dashboard.

**Arquivos:**
- `frontend/src/app/shared/components/layout/layout.component.ts`
- `frontend/src/app/features/dashboard/dashboard.routes.ts`
- `frontend/src/app/features/dashboard/pages/dashboard/dashboard.component.ts`
- `frontend/src/app/features/dashboard/pages/dashboard/dashboard.component.html`

**Pronto quando:**
- Rota `/dashboard` é acessível apenas com autenticação
- Layout exibe navegação com links para Dashboard e Sessões
- Dashboard exibe um resumo simples (ex.: total de sessões ativas)

---

## Fase 3 — Participantes

### T-014 · Módulo de participantes (backend)

Implementar CRUD de participantes aninhado nas sessões.

**Arquivos:**
- `backend/src/participants/participants.module.ts`
- `backend/src/participants/participants.controller.ts`
- `backend/src/participants/participants.service.ts`
- `backend/src/participants/dto/create-participant.dto.ts`
- `backend/src/participants/dto/update-participant.dto.ts`
- `backend/src/participants/dto/participant-response.dto.ts`

**Pronto quando:**
- `POST /api/sessions/:sessionId/participants` cria participante; ignora `energy`/`maxEnergy` para `CREATURE`
- `GET /api/sessions/:sessionId/participants` retorna lista ordenada por `initiative` decrescente (nulos por último)
- `PATCH /api/sessions/:sessionId/participants/:id` atualiza os campos permitidos
- `DELETE /api/sessions/:sessionId/participants/:id` remove o participante
- Todas as rotas validam que a sessão pertence ao mestre autenticado

---

### T-015 · Serviço de participantes (frontend)

Criar o serviço Angular para consumir as rotas de participantes.

**Arquivos:**
- `frontend/src/app/features/participants/services/participants.service.ts`

**Pronto quando:**
- `getParticipants(sessionId)` retorna `Observable<Participant[]>`
- `createParticipant(sessionId, data)` retorna `Observable<Participant>`
- `updateParticipant(sessionId, id, data)` retorna `Observable<Participant>`
- `deleteParticipant(sessionId, id)` retorna `Observable<void>`

---

### T-016 · Componente de card de participante

Exibir e editar os atributos de um participante (HP, Energia, iniciativa, condições).

**Arquivos:**
- `frontend/src/app/features/participants/components/participant-card/participant-card.component.ts`
- `frontend/src/app/features/participants/components/participant-card/participant-card.component.html`

**Pronto quando:**
- Card exibe nome, tipo, HP atual/máximo e iniciativa
- Campo Energia é exibido apenas para `PC` e `NPC`
- HP e Energia são editáveis inline com PATCH imediato ao confirmar
- Card do participante ativo na rodada recebe destaque visual
- Participante inativo (`isActive: false`) é exibido com estado visual diferenciado

---

### T-017 · Componente de lista de participantes

Renderizar todos os participantes de uma sessão em ordem de iniciativa.

**Arquivos:**
- `frontend/src/app/features/participants/components/participant-list/participant-list.component.ts`
- `frontend/src/app/features/participants/components/participant-list/participant-list.component.html`

**Pronto quando:**
- Lista exibe os `ParticipantCard` ordenados por iniciativa (maior → menor; sem iniciativa por último)
- Botão "Adicionar Participante" abre dialog com formulário (nome, tipo, HP, Energia se PC/NPC, iniciativa)
- Remover participante exibe confirmação antes de deletar

---

## Fase 4 — Iniciativa

### T-018 · Módulo de iniciativa (backend)

Implementar a lógica de avanço e reset de turno.

**Arquivos:**
- `backend/src/initiative/initiative.module.ts`
- `backend/src/initiative/initiative.controller.ts`
- `backend/src/initiative/initiative.service.ts`
- `backend/src/initiative/dto/advance-turn.dto.ts`

**Pronto quando:**
- `POST /api/sessions/:sessionId/initiative/advance` incrementa `currentTurn` e retorna o `activeParticipantId` (próximo participante ativo na ordem de iniciativa)
- `POST /api/sessions/:sessionId/initiative/reset` zera `currentTurn` para 1 e aponta para o participante de maior iniciativa
- Participantes `isActive: false` são ignorados na ordem de iniciativa

---

### T-019 · Serviço e componente de controle de iniciativa (frontend)

Exibir a ordem de iniciativa e permitir avançar/resetar o turno.

**Arquivos:**
- `frontend/src/app/features/initiative/services/initiative.service.ts`
- `frontend/src/app/features/initiative/components/initiative-tracker/initiative-tracker.component.ts`
- `frontend/src/app/features/initiative/components/initiative-tracker/initiative-tracker.component.html`

**Pronto quando:**
- `InitiativeTrackerComponent` exibe o número do turno atual e o nome do participante ativo
- Botão "Próximo" chama `advance` e atualiza os signals de turno e participante ativo
- Botão "Reiniciar" exibe confirmação e chama `reset`
- `ParticipantCard` do participante ativo recebe destaque automaticamente via signal

---

## Fase 5 — Condições

### T-020 · Módulo de condições (backend)

Implementar o endpoint de catálogo e as rotas de aplicação/remoção de condições em participantes.

**Arquivos:**
- `backend/src/conditions/conditions.module.ts`
- `backend/src/conditions/conditions.controller.ts`
- `backend/src/conditions/conditions.service.ts`
- `backend/src/conditions/dto/apply-condition.dto.ts`
- `backend/src/conditions/dto/condition-response.dto.ts`

**Pronto quando:**
- `GET /api/conditions` retorna as 28 condições do catálogo
- `POST /api/sessions/:sessionId/participants/:participantId/conditions` aplica uma condição com `duration` opcional
- `DELETE /api/sessions/:sessionId/participants/:participantId/conditions/:id` remove a condição aplicada
- Rotas validam que o participante pertence à sessão do mestre autenticado

---

### T-021 · Serviço de condições (frontend)

Criar o serviço Angular para consumir o catálogo e as rotas de condições.

**Arquivos:**
- `frontend/src/app/features/conditions/services/conditions.service.ts`

**Pronto quando:**
- `getConditions()` retorna `Observable<Condition[]>` (catálogo completo)
- `applyCondition(sessionId, participantId, conditionId, duration?)` retorna `Observable<ParticipantCondition>`
- `removeCondition(sessionId, participantId, conditionId)` retorna `Observable<void>`

---

### T-022 · Componente de badge de condição

Exibir as condições ativas de um participante com opção de remover.

**Arquivos:**
- `frontend/src/app/features/conditions/components/condition-badge/condition-badge.component.ts`
- `frontend/src/app/features/conditions/components/condition-badge/condition-badge.component.html`

**Pronto quando:**
- `ConditionBadge` exibe o nome da condição e a duração (ou "—" se indefinida)
- Clicar no badge exibe tooltip com a descrição completa da condição
- Ícone de remover elimina a condição com chamada imediata à API

---

### T-023 · Integração de condições no card de participante

Conectar a UI de condições ao `ParticipantCard`.

**Arquivos:**
- `frontend/src/app/features/participants/components/participant-card/participant-card.component.ts` (modificação)
- `frontend/src/app/features/participants/components/participant-card/participant-card.component.html` (modificação)

**Pronto quando:**
- `ParticipantCard` lista os `ConditionBadge` de cada condição ativa
- Botão "Adicionar Condição" abre dropdown/dialog com o catálogo completo
- Ao selecionar uma condição, é possível informar duração (opcional) antes de confirmar
- Condição adicionada aparece no card imediatamente após a resposta da API

---

## Fase 6 — Página de Sessão

### T-024 · Página de detalhe da sessão

Compor a tela principal de combate reunindo todos os componentes.

**Arquivos:**
- `frontend/src/app/features/sessions/pages/session-detail/session-detail.component.ts`
- `frontend/src/app/features/sessions/pages/session-detail/session-detail.component.html`

**Pronto quando:**
- Rota `/sessions/:id` carrega os dados da sessão e inicializa os signals
- `InitiativeTrackerComponent` está posicionado no topo da página
- `ParticipantList` está posicionado abaixo do tracker
- Status da sessão é exibido com botões para pausar/encerrar
- Navegação de volta para `/sessions` está disponível

---

## Fase 7 — Qualidade e Entrega

### T-025 · Documentação Swagger completa

Garantir que todos os endpoints estão documentados com decorators do `@nestjs/swagger`.

**Arquivos:**
- Todos os controllers e DTOs do backend (modificação)

**Pronto quando:**
- Swagger em `/api/docs` exibe todos os 17 endpoints com body, responses e descrições
- Endpoints protegidos exibem o cadeado de autenticação no Swagger UI

---

### T-026 · Atualização do CLAUDE.md

Registrar o stack, comandos de build/test e estrutura do projeto.

**Arquivos:**
- `CLAUDE.md`

**Pronto quando:**
- CLAUDE.md contém comandos para rodar backend, frontend e banco de dados
- Stack e decisões de arquitetura relevantes estão documentados
