# Jujutsu Dashboard 

Дашборд для мониторинга аномалий (духов) в реальном времени.

##  Запуск

### Development
```bash
docker-compose up app-dev
```
###  Production
```bash
docker-compose up app-prod --build
```
Приложение доступно: http://localhost:3001

## Функционал

✅ Real-time мониторинг - SSE обновления каждые 5 секунд
✅ Захват духов - Optimistic updates с 30% вероятностью ошибки
✅ Цикличный пул - Духи респавнятся случайно (50% шанс)
✅ Валидация - Zod для всех входящих данных
✅ Архитектура - Feature Sliced Design
✅ Стилизация - SCSS Modules
✅ State management - TanStack Query

##  Архитектура 

src/
├── app/                    # Next.js App Router
├── features/              # Бизнес-фичи
│   ├── capture-spirit/    # Захват духов
│   ├── spirits-list/      # Список духов
│   └── real-time-updates/ # SSE обновления
├── entities/              # Сущности
│   └── spirit/           # Дух (карточка, схемы)
├── shared/               # Переиспользуемые модули
│   ├── api/              # API клиенты
│   ├── ui/               # UI компоненты
│   └── lib/              # Утилиты
└── widgets/              # Виджеты (композиция фич)

## Технологический стек

✅ Next.js 14 (App Router)
✅ React 18 с TypeScript
✅ TanStack Query для state management
✅ Zod для валидации
✅ SCSS Modules для стилизации
✅ Docker Compose для контейнеризации
