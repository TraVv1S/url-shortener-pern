# URL Shortener

Простое приложение для сокращения длинных ссылок (короткие URL).

## Описание
Этот проект реализует API и веб-интерфейс для создания коротких ссылок, которые перенаправляют на оригинальные длинные URL. Основная цель — предоставить простой сервис для сокращения ссылок, как указано в [тестовом задании](https://docs.google.com/document/d/1b0GB4c63ABHKZZfNJ0yTv5djHk8ct9hgfXKgJxUdTM8/edit?tab=t.0).

## Стек технологий
- Backend: NestJS, Prisma, PostgreSQL
- Frontend: Next.js (React)
- Docker для контейнеризации

## Быстрый старт
1. Клонируйте репозиторий:
   ```bash
   git clone <repo-url>
   ```
2. Запустите проект с помощью Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Перейдите на `http://localhost:3000` для доступа к веб-интерфейсу.

## Основные возможности
- Генерация коротких ссылок для длинных URL
- Перенаправление по коротким ссылкам
- Просмотр и управление своими ссылками через веб-интерфейс
