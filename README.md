# Contratados: Painel Tático

Aplicação web para mestres de **Contratados RPG** gerenciarem combates — controle de iniciativa, condições, atributos e fluxo de encontros.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Angular 21 + PrimeNG 21 |
| Backend | NestJS 11 (Node.js 22) |
| Banco | PostgreSQL 16 (Docker) |
| ORM | Prisma 6 |
| Linguagem | TypeScript |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v22+ (testado em v24.11)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Como rodar em desenvolvimento

**1. Suba o banco de dados**
```bash
docker compose up -d db
```

**2. Configure as variáveis de ambiente do backend**
```bash
cp .env.example .env
cp backend/.env.example backend/.env
# edite backend/.env e preencha JWT_SECRET
```

**3. Instale as dependências**
```bash
cd backend && npm install
cd ../frontend && npm install
```

**4. Execute as migrations e o seed**
```bash
cd backend
npx prisma migrate dev
npm run prisma:seed
```

**5. Suba o backend**
```bash
cd backend
npm run start:dev
```

**6. Suba o frontend** (novo terminal)
```bash
cd frontend
npm start
```

| Serviço | URL |
|---|---|
| Frontend | http://localhost:4200 |
| API | http://localhost:3000/api |
| Swagger | http://localhost:3000/api/docs |

---

## Estrutura do projeto

```
contratados-painel-tatico/
├── backend/
│   ├── prisma/          # schema, migrations, seed
│   └── src/
│       ├── modules/     # domínios (auth, users, sessions…)
│       ├── shared/      # helpers, middlewares
│       └── config/      # variáveis de ambiente
├── frontend/
│   └── src/app/
│       ├── features/    # módulos por domínio
│       ├── shared/      # componentes reutilizáveis
│       └── core/        # guards, interceptors
├── docs/                # documentação oficial do sistema RPG
├── specs/               # requirements, design e tasks
└── docker-compose.yml
```

---

## Documentação

- **Regras do sistema RPG**: [`docs/sistema-v4.0.0.md`](docs/sistema-v4.0.0.md)
- **Requisitos do software**: [`specs/requirements.md`](specs/requirements.md)
- **Arquitetura e design**: [`specs/design.md`](specs/design.md)
- **Progresso das tasks**: [`specs/tasks.md`](specs/tasks.md)
