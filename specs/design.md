# Design 001 - Painel Tático do Mestre

## 1. Arquivos a criar

### Raiz do projeto

```
contratados-painel-tatico/
├── docker-compose.yml
├── .env.example
└── README.md
```

### Backend (`backend/`)

```
backend/
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .env.example
├── Dockerfile
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── auth/
    │   ├── auth.module.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.guard.ts
    │   ├── jwt.strategy.ts
    │   └── dto/
    │       ├── login.dto.ts
    │       └── auth-response.dto.ts
    ├── users/
    │   ├── users.module.ts
    │   ├── users.service.ts
    │   └── entities/
    │       └── user.entity.ts
    ├── sessions/
    │   ├── sessions.module.ts
    │   ├── sessions.controller.ts
    │   ├── sessions.service.ts
    │   └── dto/
    │       ├── create-session.dto.ts
    │       ├── update-session.dto.ts
    │       └── session-response.dto.ts
    ├── participants/
    │   ├── participants.module.ts
    │   ├── participants.controller.ts
    │   ├── participants.service.ts
    │   └── dto/
    │       ├── create-participant.dto.ts
    │       ├── update-participant.dto.ts
    │       └── participant-response.dto.ts
    ├── initiative/
    │   ├── initiative.module.ts
    │   ├── initiative.controller.ts
    │   ├── initiative.service.ts
    │   └── dto/
    │       └── advance-turn.dto.ts
    ├── conditions/
    │   ├── conditions.module.ts
    │   ├── conditions.controller.ts
    │   ├── conditions.service.ts
    │   └── dto/
    │       ├── apply-condition.dto.ts
    │       └── condition-response.dto.ts
    └── prisma/
        ├── prisma.module.ts
        └── prisma.service.ts
```

### Frontend (`frontend/`)

```
frontend/
├── package.json
├── tsconfig.json
├── angular.json
├── Dockerfile
└── src/
    ├── main.ts
    ├── index.html
    ├── styles.scss
    ├── environments/
    │   ├── environment.ts
    │   └── environment.prod.ts
    └── app/
        ├── app.config.ts
        ├── app.routes.ts
        ├── core/
        │   ├── interceptors/
        │   │   └── auth.interceptor.ts
        │   ├── guards/
        │   │   └── auth.guard.ts
        │   └── services/
        │       └── auth.service.ts
        ├── shared/
        │   └── components/
        │       └── layout/
        │           └── layout.component.ts
        └── features/
            ├── auth/
            │   ├── auth.routes.ts
            │   └── pages/
            │       └── login/
            │           ├── login.component.ts
            │           └── login.component.html
            ├── dashboard/
            │   ├── dashboard.routes.ts
            │   └── pages/
            │       └── dashboard/
            │           ├── dashboard.component.ts
            │           └── dashboard.component.html
            ├── sessions/
            │   ├── sessions.routes.ts
            │   ├── services/
            │   │   └── sessions.service.ts
            │   └── pages/
            │       ├── session-list/
            │       │   ├── session-list.component.ts
            │       │   └── session-list.component.html
            │       └── session-detail/
            │           ├── session-detail.component.ts
            │           └── session-detail.component.html
            ├── participants/
            │   ├── services/
            │   │   └── participants.service.ts
            │   └── components/
            │       ├── participant-list/
            │       │   ├── participant-list.component.ts
            │       │   └── participant-list.component.html
            │       └── participant-card/
            │           ├── participant-card.component.ts
            │           └── participant-card.component.html
            ├── initiative/
            │   ├── services/
            │   │   └── initiative.service.ts
            │   └── components/
            │       └── initiative-tracker/
            │           ├── initiative-tracker.component.ts
            │           └── initiative-tracker.component.html
            └── conditions/
                ├── services/
                │   └── conditions.service.ts
                └── components/
                    └── condition-badge/
                        ├── condition-badge.component.ts
                        └── condition-badge.component.html
```

---

## UI/UX

### Estilização

- **Tailwind CSS** para layout, espaçamento, tipografia e cores utilitárias
- **SCSS + BEM** para estilos específicos de componente que o Tailwind não cobre bem (estados complexos, variações de tema, animações)
- Convenção BEM: `bloco__elemento--modificador`, sempre em kebab-case (ex: `participant-card__hp-bar--critical`)
- Componentes PrimeNG customizados via `pt` (PassThrough API) — nunca sobrescrever CSS global do PrimeNG
- Paleta de cores e tokens definidos em `frontend/src/styles/tokens.scss` e espelhados no `tailwind.config.ts`

### Tokens e tema

- `frontend/src/styles/tokens.scss` — fonte única de verdade para cores, espaçamentos e tipografia
- `tailwind.config.ts` — espelha os tokens como valores estáticos e via CSS custom properties
- `styles.scss` reservado para: import dos tokens, import da Inter (Google Fonts), tema PrimeNG e reset global

### Identidade visual

**Conceito:** clareza tática. Interface clara e densa — fundo claro com sidebar escura, destaque em vermelho para estados críticos.

**Restrições absolutas:**
- Sem gradientes
- Sem `box-shadow` — separação visual feita exclusivamente com bordas (`1px solid var(--color-border)`) e diferença de cor de fundo
- Sem `font-weight` ≥ 700
- Sem `border-radius` > 8px
- Sem `style=""` inline nos templates
- Nunca usar hex direto nos componentes — sempre variáveis CSS dos tokens

**Componentes e uso de tokens:**

| Área | Token(s) | Comportamento |
|---|---|---|
| Sidebar | `--color-bg-black` | Fundo escuro; item ativo com borda esquerda `--color-red` |
| Cards | `--color-bg-surface`, `--color-border`, `--radius-xl` | Fundo branco, borda sutil, radius 8px |
| Participante ativo | `--color-red` | Borda e header em vermelho |
| HP crítico (≤ 30%) | `--color-hp-low` | Texto e barra em `--color-hp-low` (= `--color-red`) |
| Participante inativo | — | `opacity: 0.5` |
| Barra de iniciativa | `--color-bg-black` | Fundo escuro, texto `--color-text-light` |

**Paleta de cores:**

| Token | Valor | Uso |
|---|---|---|
| `--color-bg-base` | `#f5f4f2` | Fundo principal |
| `--color-bg-surface` | `#ffffff` | Cards e painéis |
| `--color-bg-surface-2` | `#f0efed` | Superfície secundária, zebra |
| `--color-bg-black` | `#111111` | Sidebar, barras de iniciativa |
| `--color-bg-black-2` | `#1a1a1a` | Variante escura 2 |
| `--color-bg-black-3` | `#1e1e1e` | Variante escura 3 |
| `--color-border` | `#e2e0dc` | Bordas padrão |
| `--color-border-strong` | `#c8c5bf` | Bordas de destaque |
| `--color-border-dark` | `#2a2a2a` | Bordas em contexto escuro |
| `--color-red` | `#c0392b` | Ações primárias, participante ativo, HP crítico |
| `--color-red-hover` | `#a93226` | Hover de ações primárias |
| `--color-red-light` | `#f9ecea` | Fundo de alertas |
| `--color-red-border` | `#e8b4ae` | Borda de alertas |
| `--color-red-muted` | `#7d2a22` | Badges de status |
| `--color-text-primary` | `#1a1a1a` | Texto principal |
| `--color-text-secondary` | `#5a5855` | Labels, metadados |
| `--color-text-muted` | `#9a9794` | Placeholders, desabilitados |
| `--color-text-light` | `#f0f0f0` | Texto sobre fundos escuros |
| `--color-hp-ok` | `#2ecc71` | HP normal |
| `--color-hp-low` | `#c0392b` | HP crítico (≤ 30%) |

**Tipografia:**
- Família: `Inter`, `system-ui`, `sans-serif` (importar via `index.html`, pesos 400/500/600)
- Escala: 10 / 11 / 12 / 13 / 14 / 20px
- Peso máximo: 600 (semibold)

**Forma:**
- `--radius-sm`: 3px — inputs, badges pequenos
- `--radius-md`: 4px — padrão global
- `--radius-lg`: 6px — intermediário
- `--radius-xl`: 8px — cards
- Bordas: `1px solid var(--color-border)`

---

## 2. Contratos das rotas de API

Base URL: `/api`

Todas as rotas, exceto `POST /api/auth/login`, requerem `Authorization: Bearer <token>`.

### Auth

#### `POST /api/auth/login`

**Body:**
```json
{ "email": "string", "password": "string" }
```

**Response 200:**
```json
{
  "accessToken": "string",
  "user": { "id": "string", "email": "string", "name": "string" }
}
```

**Response 401:**
```json
{ "message": "Credenciais inválidas" }
```

---

### Sessions

#### `GET /api/sessions`

**Response 200:**
```json
[
  {
    "id": "string",
    "name": "string",
    "status": "ACTIVE | PAUSED | FINISHED",
    "currentTurn": 0,
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
  }
]
```

#### `POST /api/sessions`

**Body:**
```json
{ "name": "string" }
```

**Response 201:** objeto Session criado.

#### `GET /api/sessions/:id`

**Response 200:**
```json
{
  "id": "string",
  "name": "string",
  "status": "ACTIVE | PAUSED | FINISHED",
  "currentTurn": 0,
  "participants": [
    {
      "id": "string",
      "name": "string",
      "type": "PC | NPC | CREATURE",
      "initiative": "number | null",
      "hp": 0,
      "maxHp": 0,
      "energy": "number | null",
      "maxEnergy": "number | null",
      "isActive": true,
      "conditions": [
        { "id": "string", "name": "string", "duration": "number | null" }
      ]
    }
  ],
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

> `energy` e `maxEnergy` são sempre `null` para participantes do tipo `CREATURE`.

#### `PATCH /api/sessions/:id`

**Body (parcial):**
```json
{ "name": "string?", "status": "ACTIVE | PAUSED | FINISHED?" }
```

**Response 200:** objeto Session atualizado.

#### `DELETE /api/sessions/:id`

**Response 204:** sem corpo.

---

### Participants

#### `GET /api/sessions/:sessionId/participants`

**Response 200:** array de Participant ordenado por `initiative` decrescente.

#### `POST /api/sessions/:sessionId/participants`

**Body:**
```json
{
  "name": "string",
  "type": "PC | NPC | CREATURE",
  "hp": 0,
  "maxHp": 0,
  "energy": "number?",
  "maxEnergy": "number?",
  "initiative": "number?"
}
```

> Para `type: CREATURE`, os campos `energy` e `maxEnergy` são ignorados pelo backend.

**Response 201:** objeto Participant criado.

#### `PATCH /api/sessions/:sessionId/participants/:id`

**Body (parcial):**
```json
{
  "hp": "number?",
  "maxHp": "number?",
  "energy": "number?",
  "maxEnergy": "number?",
  "initiative": "number?",
  "isActive": "boolean?"
}
```

**Response 200:** objeto Participant atualizado.

#### `DELETE /api/sessions/:sessionId/participants/:id`

**Response 204:** sem corpo.

---

### Initiative

#### `POST /api/sessions/:sessionId/initiative/advance`

**Response 200:**
```json
{ "currentTurn": 1, "activeParticipantId": "string" }
```

#### `POST /api/sessions/:sessionId/initiative/reset`

**Response 200:**
```json
{ "currentTurn": 1, "activeParticipantId": "string" }
```

---

### Conditions

#### `GET /api/conditions`
Catálogo completo de condições do sistema Contratados (dados fixos via seed).

**Response 200:**
```json
[
  { "id": "string", "name": "string", "description": "string" }
]
```

#### `POST /api/sessions/:sessionId/participants/:participantId/conditions`

**Body:**
```json
{ "conditionId": "string", "duration": "number?" }
```

**Response 201:**
```json
{
  "id": "string",
  "conditionId": "string",
  "name": "string",
  "duration": "number | null",
  "appliedAt": "ISO 8601"
}
```

#### `DELETE /api/sessions/:sessionId/participants/:participantId/conditions/:id`

**Response 204:** sem corpo.

---

## 3. Schema do banco de dados

### `users`

| Campo        | Tipo         | Restrições                      |
|--------------|--------------|---------------------------------|
| id           | UUID         | PK, default uuid()              |
| email        | VARCHAR(255) | UNIQUE, NOT NULL                |
| name         | VARCHAR(255) | NOT NULL                        |
| passwordHash | TEXT         | NOT NULL                        |
| createdAt    | TIMESTAMPTZ  | default now()                   |
| updatedAt    | TIMESTAMPTZ  | atualizado automaticamente      |

---

### `sessions`

| Campo       | Tipo         | Restrições                                    |
|-------------|--------------|-----------------------------------------------|
| id          | UUID         | PK, default uuid()                            |
| userId      | UUID         | FK → users.id, NOT NULL                       |
| name        | VARCHAR(255) | NOT NULL                                      |
| status      | ENUM         | ACTIVE, PAUSED, FINISHED; default ACTIVE      |
| currentTurn | INTEGER      | default 0                                     |
| createdAt   | TIMESTAMPTZ  | default now()                                 |
| updatedAt   | TIMESTAMPTZ  | atualizado automaticamente                    |

---

### `participants`

PC e NPC possuem Vida e Energia. CREATURE possui apenas Vida.
Todos os tipos são passíveis de condições.

| Campo      | Tipo         | Restrições                                        |
|------------|--------------|---------------------------------------------------|
| id         | UUID         | PK, default uuid()                                |
| sessionId  | UUID         | FK → sessions.id, NOT NULL, ON DELETE CASCADE     |
| name       | VARCHAR(255) | NOT NULL                                          |
| type       | ENUM         | PC, NPC, CREATURE; NOT NULL                       |
| initiative | INTEGER      | nullable                                          |
| hp         | INTEGER      | NOT NULL                                          |
| maxHp      | INTEGER      | NOT NULL                                          |
| energy     | INTEGER      | nullable (NULL para CREATURE)                     |
| maxEnergy  | INTEGER      | nullable (NULL para CREATURE)                     |
| isActive   | BOOLEAN      | default true                                      |
| createdAt  | TIMESTAMPTZ  | default now()                                     |
| updatedAt  | TIMESTAMPTZ  | atualizado automaticamente                        |

---

### `conditions` (catálogo)

| Campo       | Tipo         | Restrições              |
|-------------|--------------|-------------------------|
| id          | UUID         | PK, default uuid()      |
| name        | VARCHAR(100) | UNIQUE, NOT NULL        |
| description | TEXT         | nullable                |

Populada via seed com as condições oficiais do sistema Contratados:

| Nome           | Descrição resumida                                                                    |
|----------------|---------------------------------------------------------------------------------------|
| Abalado        | -5 iniciativa, -1 dado em todos os testes (exceto para se afastar da fonte)           |
| Agarrado       | Impossibilitado de agir; pode apenas reagir                                           |
| Amedrontado    | -1 dado em testes ao ver o causador; -2 dados ao perdê-lo de vista                   |
| Atordoado      | -1 dado em todos os testes                                                            |
| Breu           | +1 dado Sentidos (audição), -1 dado nos demais testes (exceto Intelecto)              |
| Cansado        | -2 dados em Destreza, Força, Luta e Pontaria                                          |
| Cego           | -2 dados em Luta e Pontaria; não pode mirar                                           |
| Debilitado     | -3 por ponto de lesão restante no atributo afetado                                   |
| Eletrificado   | -1 dado em Destreza e Luta por 1 turno                                                |
| Em Chamas      | 2D6 dano Físico-Químico por turno até superar DT Destreza do causador                |
| Envenenado     | 3D4 + Intelecto dano Químico por turno até superar DT Intelecto com Vigor             |
| Escuridão      | +2 dados Sentidos (audição), -2 dados nos demais testes (exceto Intelecto)            |
| Fascinado      | Cessa ações hostis; -5 em todos os testes (exceto Vontade)                            |
| Flanqueando    | +1 dado de dano (requer aliado em paralelo que atacou no turno anterior)              |
| Furtivo        | +1 dado em ataques; inibe reações do alvo; deslocamento pela metade                  |
| Hesitante      | -5 na iniciativa                                                                      |
| Imobilizado    | Impossibilitado de agir e reagir                                                      |
| Inconsciente   | Impossibilitado de agir ou reagir; recebe Vulnerável                                  |
| Insano         | Ataca qualquer ser ao redor com tudo que pode                                         |
| Lentidão       | -2 metros de deslocamento                                                             |
| Machucado      | Golpe removeu metade da vida; remove apenas ao recuperar 100% de HP                  |
| Morrendo       | Teste de Vigor por turno (DT 5 +5/turno); falhar = morte                             |
| Paralisado     | Incapaz de agir ou reagir (habilidades passivas ainda funcionam)                      |
| Provocado      | Todos os ataques devem ser direcionados ao causador da condição                       |
| Sangramento    | 2D6 + Força dano Físico por turno até superar DT Força com Vigor                     |
| Sobrecarregado | Deslocamento 4m; -2 dados em FOR, DES, LUT, VIG, PON e MED; -5 Defesa               |
| Surdo          | -1 dado em Sentidos auditivos; percepção reduzida a Sentidos × 3 metros              |
| Vulnerável     | +1 dado de dano dos atacantes; -5 Defesa                                              |

---

### `participant_conditions`

| Campo         | Tipo        | Restrições                                     |
|---------------|-------------|------------------------------------------------|
| id            | UUID        | PK, default uuid()                             |
| participantId | UUID        | FK → participants.id, ON DELETE CASCADE        |
| conditionId   | UUID        | FK → conditions.id                             |
| duration      | INTEGER     | nullable (null = até cessar a condição)        |
| appliedAt     | TIMESTAMPTZ | default now()                                  |

---

## 4. Fluxo de dados entre frontend e backend

### Login

```
LoginComponent
  → AuthService.login(email, password)
  → POST /api/auth/login
  → accessToken salvo no localStorage
  → redireciona para /dashboard
```

### Listagem de sessões

```
SessionListComponent (init)
  → SessionsService.getSessions()
  → GET /api/sessions
  → signal sessions[] atualizado
  → template re-renderiza via @for
```

### Abrir sessão de combate

```
SessionDetailComponent (init com :id)
  → SessionsService.getSession(id)
  → GET /api/sessions/:id
  → signals: session, participants[] atualizados
  → InitiativeTrackerComponent e ParticipantList renderizam
```

### Avançar turno

```
InitiativeTrackerComponent → botão "Próximo"
  → InitiativeService.advance(sessionId)
  → POST /api/sessions/:sessionId/initiative/advance
  → response: { currentTurn, activeParticipantId }
  → signals currentTurn e activeParticipantId atualizados
  → ParticipantCard do participante ativo recebe destaque
```

### Alterar atributo de participante

```
ParticipantCard → input HP ou Energia
  → ParticipantsService.update(sessionId, participantId, { hp | energy })
  → PATCH /api/sessions/:sessionId/participants/:id
  → signal participants[] atualiza o item correspondente

Nota: campos energy/maxEnergy só são exibidos para PC e NPC.
```

### Aplicar condição

```
ParticipantCard → selecionar condição
  → ConditionsService.apply(sessionId, participantId, conditionId, duration?)
  → POST /api/sessions/:sessionId/participants/:id/conditions
  → signal conditions[] do participante atualizado
  → ConditionBadge renderizado
```

### Interceptor de autenticação

```
Toda requisição HTTP
  → AuthInterceptor injeta: Authorization: Bearer <token>
  → Se response 401 → AuthService.logout() → redireciona para /login
```

---

## 5. Decisões técnicas relevantes

### Status vitais por tipo de participante

O sistema Contratados diferencia os status vitais conforme o tipo:

| Tipo     | Vida | Energia | Condições |
|----------|------|---------|-----------|
| PC       | ✓    | ✓       | ✓         |
| NPC      | ✓    | ✓       | ✓         |
| CREATURE | ✓    | —       | ✓         |

- Criaturas possuem apenas Vida, mas são passíveis de todas as condições.
- O banco armazena `energy` e `maxEnergy` como `NULL` para criaturas.
- O frontend oculta os campos de Energia via `@if(participant.type !== 'CREATURE')`.

### Backend

| Decisão | Justificativa |
|---------|---------------|
| NestJS com módulos por feature | Alinha com o requisito de modularidade; cada feature pode crescer ou ser extraída de forma independente. |
| Prisma ORM | Type-safety no acesso ao banco, migrations versionadas, integração natural com TypeScript. |
| JWT stateless | Sem sessão no servidor; simplifica a infraestrutura e facilita adicionar jogadores no futuro. |
| Enum `status` na sessão | Distingue combate ativo, pausado e encerrado de forma explícita. |
| Enum `type` em participants | `PC | NPC | CREATURE` guia a lógica de campos opcionais no backend e a UI no frontend. |
| Condições como catálogo no banco | Permite adicionar ou alterar condições via seed/migration sem deploy de código. |
| `duration` nullable em `participant_conditions` | `NULL` representa "até cessar a condição" (conforme regra do sistema); inteiro representa turnos restantes. |

### Frontend

| Decisão | Justificativa |
|---------|---------------|
| Angular Signals | Reatividade fina sem Zone.js; alinhado ao requisito. |
| Standalone Components | Sem NgModules desnecessários; tree-shaking mais eficiente. |
| Feature folders com lazy routes | Isolamento entre features; cada uma carrega sob demanda. |
| PrimeNG | Componentes prontos (DataTable, Badge, InputNumber, Dialog) aceleram a construção da UI. |
| Token no localStorage | Simplicidade para v1; troca por cookie httpOnly pode ser feita sem alterar contratos de API. |
| AuthInterceptor global | Centraliza a injeção do token e o tratamento de 401 em um único ponto. |
| Ordenação de iniciativa no frontend | O backend persiste o valor numérico; a ordenação é feita via computed signal. |
| Renderização condicional por `type` | `ParticipantCard` usa `@if` para mostrar Energia apenas para PC e NPC. |

### Infraestrutura

| Decisão | Justificativa |
|---------|---------------|
| Docker Compose com três serviços (db, backend, frontend) | Ambiente reproduzível; um único `docker compose up` levanta tudo. |
| Swagger via `@nestjs/swagger` | Documentação automática dos contratos sem esforço manual. |
| `.env.example` em ambos os projetos | Deixa explícito quais variáveis são necessárias sem commitar segredos. |

### Extensibilidade futura

- Uma coluna `role` na tabela `users` pode ser adicionada via migration para suportar jogadores sem quebrar o schema atual.
- O módulo `sessions` pode emitir eventos (NestJS EventEmitter) que um futuro módulo `multiplayer` consome via WebSocket, sem alterar o fluxo REST existente.
- A coluna `currentTurn` em `sessions` já prepara o controle de turno para o módulo `initiative`.
- Sanidade e sequelas podem ser adicionadas como campos opcionais em `participants` no futuro sem impacto nas rotas existentes.
