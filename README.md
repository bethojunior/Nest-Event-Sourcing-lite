# Boilerplate Nest Event Driven/Sourcing lite

API REST + WebSocket construída com NestJS 11, servindo como backend principal do projeto Madgic.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js ≥ 20.11 |
| Framework | NestJS 11 |
| ORM | Prisma 6 |
| Banco de dados | PostgreSQL |
| Cache | Redis (redis-stack-server 7.4) |
| Fila | RabbitMQ 4.0 |
| Auth | JWT + Passport |
| WebSocket | Socket.IO 4 |
| Mail | Nodemailer via @nestjs-modules/mailer |
| Notificação | Discord Webhook |

---

## Requisitos

- Node.js >= 20.11
- Yarn 1.x
- Docker + Docker Compose

---

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
APP_URL=
APP_PORT=3002
ENV=dev

DATABASE_URL=postgres://root:password@localhost:5432/database
DATABASE_READ_URL=postgres://root:password@localhost:5433/database

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

JWT_SECRET=
JWT_EXPIRATION_TIME=7d
SESSION_SECRET=

MAIL_HOST=smtp.zoho.com
MAIL_PORT=587
MAIL_USER=
MAIL_PASSWORD=

DISCORD_URL=

RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

---

## Rodando localmente

### Infraestrutura

```bash
docker compose -f infra/docker-compose.dev.yaml up -d
```

Sobe: `postgres-write` (5432), `postgres-read` (5433, replica), Redis (6379), RabbitMQ (5672).

### Aplicação

```bash
yarn install
npx prisma migrate dev
yarn start:dev
```

---

## Rodando em produção (Docker)

```bash
docker compose -f infra/docker-compose.yaml up -d --build
```

A imagem é construída via `infra/Dockerfile`. O entrypoint executa as migrations automaticamente antes de iniciar o servidor.

---

## Estrutura

```
src/
├── modules/v1/
│   ├── auth/                        # Autenticação JWT
│   │   ├── consumers/               # useCreated.event.consumer
│   │   ├── entities/                # useCreated.entity
│   │   └── dto/
│   └── blog/                        # CRUD de blog (exemplo)
│       ├── consumers/               # blogCreated.consumer
│       ├── entities/
│       └── dto/
├── providers/
│   ├── prisma/
│   │   ├── prisma-write.provider    # DATABASE_URL (5432, escrita)
│   │   └── prisma-read.provider     # DATABASE_READ_URL (5433, leitura)
│   ├── event-bus/                   # Publica no RabbitMQ + persiste evento no DB
│   ├── redis/
│   ├── cache/
│   ├── mail/
│   ├── s3/
│   └── notification/                # Discord webhook
├── @shared/
│   ├── entities/
│   ├── exceptions/                  # Filtros globais
│   └── events/
└── decorators/
```

### Fluxo de eventos

```
Service → EventBusService.emit()
            ├── persiste Event{status: PENDING} no postgres-write
            ├── publica no RabbitMQ
            └── Consumer recebe
                    ├── atualiza status: PROCESSING
                    ├── executa lógica
                    └── atualiza status: PROCESSED | FAILED_PROCESSING
```

---

## Scripts

| Comando | Descrição |
|---|---|
| `yarn start:dev` | Dev com hot-reload |
| `yarn build` | Compila para `dist/` |
| `yarn start:prod` | Inicia build de produção |
| `yarn test` | Testes unitários |
| `yarn test:e2e` | Testes e2e |
| `yarn lint` | Lint |

---

## Portas

| Serviço | Porta |
|---|---|
| API principal | `APP_PORT` (default 3000) |
| PostgreSQL write | 5432 |
| PostgreSQL read (replica) | 5433 |
| Redis | 6379 |
| RabbitMQ AMQP | 5672 |
| RabbitMQ Management | 15672 |
