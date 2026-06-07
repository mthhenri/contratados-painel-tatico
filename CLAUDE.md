# Projeto: Contratados Painel Tático

## Stack
- **Frontend**: Angular 21 + PrimeNG 21
- **Backend**: Node.js 22 + NestJS 11
- **Banco**: PostgreSQL (via Docker)
- **ORM**: Prisma 6 (não Prisma 7 — ver decisões abaixo)
- **Linguagem**: TypeScript em todo o projeto

## Fonte de verdade

O documento oficial do sistema está em **`docs/sistema-v4.0.0.md`**. Ele descreve as regras de negócio,
mecânicas do RPG, condições, atributos e fluxos que o painel tático implementa. Qualquer dúvida sobre
comportamento esperado deve ser respondida por esse documento antes de consultar specs ou código.

Hierarquia de consulta:
1. `docs/sistema-v4.0.0.md` — regras de negócio e domínio do sistema
2. `specs/requirements.md` — requisitos do software
3. `specs/design.md` — arquitetura e estrutura de arquivos
4. `specs/tasks.md` — tarefas a implementar

## Workflow obrigatório (Spec-Driven)
Antes de qualquer implementação:
1. Ler specs/requirements.md
2. Ler specs/design.md
3. Ler specs/tasks.md
4. Implementar SOMENTE a task indicada
5. Marcar task como [x] ao concluir

## Regras de código
- Componentes Angular: standalone components (não NgModules)
- Estilos: SCSS com variáveis PrimeNG, sem CSS global. Utilize a arquitetura de css BEM
- API REST: resposta sempre em { data, error, meta }
- Nunca criar arquivos fora da estrutura definida no design.md
- Nunca pular testes se a task exigir

## Estrutura de pastas
frontend/src/app/
  features/   ← módulos por domínio
  shared/     ← componentes e serviços reutilizáveis
  core/       ← guards, interceptors, config

backend/src/
  modules/    ← módulos por domínio (NestJS) ou routes/ (Express)
  shared/     ← helpers, middlewares
  config/     ← variáveis de ambiente

## Regras Frontend
- Sempre usar standalone components (sem NgModules)
- Importar componentes PrimeNG individualmente (tree-shaking)
- Formulários: ReactiveFormsModule (nunca FormsModule)
- HTTP: provideHttpClient() com interceptors funcionais
- Evitar any: usar tipos explícitos em todos os serviços

## Regras de UI

- Tailwind para layout, espaçamento, cores e tipografia
- BEM em SCSS apenas quando Tailwind não for suficiente (ex: `participant-card__hp-bar--critical`)
- Nunca usar `style=""` inline nos templates
- Nunca usar hex direto nos componentes — sempre variáveis CSS dos tokens (`var(--color-*)`)
- Nunca sobrescrever classes do PrimeNG com CSS global — usar PassThrough API (`pt="{...}"`)
- Componentes standalone: estilos no próprio `.scss` do componente, nunca em `styles.scss`
- `styles.scss` reservado para: import dos tokens, import do Inter (via `index.html`) e reset global
- Sidebar sempre com fundo `--color-bg-black`
- Ações primárias (botão submit, CTA) sempre em `--color-red`
- HP crítico (abaixo de 30%) sempre em `--color-hp-low` (= `--color-red`)

## Regras Backend
- Validação com class-validator em todos os DTOs
- Erros: sempre lançar HttpException com código semântico
- Variáveis de ambiente: acessar via ConfigService, nunca process.env diretamente
- Nunca commitar .env — usar .env.example como template

## Comandos do ambiente

### Subir o ambiente completo
```bash
# Na raiz do projeto — sobe todos os serviços (db, backend, frontend)
docker compose up -d

# Subir apenas o banco (útil durante desenvolvimento local)
docker compose up -d db
cd backend && npm run start:dev   # backend em modo watch (porta 3000)
cd frontend && npm start           # frontend Angular dev server (porta 4200)
```

### Migrations e seed via Docker
```bash
docker compose exec backend npx prisma migrate dev --name <nome>   # nova migration
docker compose exec backend npx prisma migrate deploy               # aplica em produção
docker compose exec backend npm run prisma:seed                     # seed de condições (idempotente)
```

### Migrations e seed locais (fora do Docker)
```bash
cd backend
npx prisma migrate dev --name <nome>
npm run prisma:seed
```

### Acompanhar logs
```bash
docker compose logs -f backend    # logs do backend em tempo real
docker compose logs -f            # logs de todos os serviços
```

### Documentação da API
Acesse http://localhost:3000/api/docs (Swagger UI — disponível com o backend rodando)

### Acesso direto ao banco
```bash
docker exec -it contratados-painel-tatico-db-1 psql -U painel -d painel_tatico
```

## Decisões técnicas registradas

### Prisma 6 ao invés de Prisma 7
Prisma 7 removeu suporte ao campo `url` no bloco `datasource` do `schema.prisma`, exigindo um arquivo
`prisma.config.ts` separado — quebrando a integração com NestJS/ConfigService. O projeto usa **Prisma 6**
(`prisma@^6`, `@prisma/client@^6`) que mantém a configuração via `DATABASE_URL` no `.env`, compatível
com o padrão do ecossistema NestJS.

### Angular 21 ao invés de Angular 22+
Angular 22+ exige Node v24.15+. O ambiente de desenvolvimento usa Node v24.11, portanto o projeto usa
**Angular 21** (`@angular/cli@21`), que permanece compatível.

### Angular Signals para estado de turno
O `InitiativeTrackerComponent` gerencia o estado de turno via `signal<number>` e `signal<string | null>`
para `currentTurn` e `activeParticipantId`. A `SessionDetailComponent` lê esses signals via `@ViewChild`
e os repassa ao `ParticipantListComponent` através de property binding.

### `activeParticipantId` público no tracker
O signal `activeParticipantId` é público em `InitiativeTrackerComponent` para que a `SessionDetailComponent`
possa lê-lo via `@ViewChild` e sincronizar o destaque visual no `ParticipantListComponent`.

### `assertOwnership` em todos os módulos de sessão
Todos os módulos que acessam recursos de sessão (`sessions`, `participants`, `initiative`, `conditions`)
verificam que a sessão pertence ao mestre autenticado antes de qualquer operação. Requisições a recursos
de outro usuário retornam 404 (não 403) para não vazar informação sobre a existência do recurso.

## Aprovação obrigatória
Antes de avançar de uma fase para outra, aguardar confirmação explícita.

## Commits e Pushes

Antes de realizar qualquer commit ou push, revise este arquivo (CLAUDE.md) e atualize-o se necessário para refletir o estado atual do projeto — stack, comandos de build/test, arquitetura, ou qualquer informação relevante que tenha mudado.

- Commitar após cada task aprovada
- Mensagem de commit: "feat(auth): task 1 — UserEntity e migration"
- Manter tasks.md atualizado no repositório
- O tasks.md versionado serve como histórico de progresso