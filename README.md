# ProStore

Минимальное приложение на Next.js (App Router) + Prisma + Neon (PostgreSQL). Главная страница читает заметки из базы.

## Локальный запуск

Нужен Node.js 20.19+, 22.12+ или 24+.

```powershell
Copy-Item .env.example .env
```

В `.env` вставьте две строки из Neon Console → Connect:

- `DATABASE_URL` — pooled, в hostname есть `-pooler`. Её использует приложение.
- `DATABASE_URL_UNPOOLED` — прямое подключение. Её использует Prisma CLI.

Интеграция Neon в Vercel задаёт те же имена переменных.

```powershell
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Откройте http://localhost:3000. Seed добавляет две заметки, если таблица пустая.

## Схема

Модель `Note`: `id` (uuid), `title` (string), `createdAt` (DateTime). Миграция лежит в `prisma/migrations`.

Новая миграция после изменения `prisma/schema.prisma`:

```powershell
npx prisma migrate dev --name описание
```

## Деплой на Vercel

1. Подключите репозиторий к Vercel.
2. В проекте Vercel подключите Neon (Marketplace). В Production и Preview должны появиться `DATABASE_URL` и `DATABASE_URL_UNPOOLED`.
3. Задеплойте. Команда сборки из `vercel.json` применяет миграции и собирает Next.js: `npm run build:vercel`.
4. Один раз заполните базу с машины, где в `.env` лежат строки Production:

```powershell
npx prisma db seed
```

После деплоя главная страница запрашивает `Note` при каждом открытии.
