# Madgic API

API REST + WebSocket construída com NestJS 11, servindo como backend principal do projeto Madgic.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js ≥ 20.11 |
| Framework | NestJS 11 |
| ORM | Prisma 6 |
| Banco de dados | PostgreSQL |
| Cache | Redis (redis-stack-server 7.2) |
| Fila | RabbitMQ 3.13 |
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

DATABASE_URL=postgres://user:pass@localhost:5433/db

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

### Infraestrutura (Redis + RabbitMQ)

```bash
docker compose -f infra/docker-compose.dev.yaml up -d
```

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
│   └── auth/           # Autenticação JWT
├── providers/
│   ├── prisma/         # Cliente Prisma
│   ├── redis/          # ioredis + cache-manager
│   ├── mail/           # Envio de e-mail
│   ├── event-bus/      # EventEmitter interno
│   └── notification/   # Discord webhook
└── @shared/
    ├── entities/
    ├── exceptions/     # Filtros globais
    ├── interceptors/
    └── events/
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
| API principal | `APP_PORT` (default 3002) |
| Redis | 6379 |
| RabbitMQ AMQP | 5672 |
| RabbitMQ Management | 15672 |
