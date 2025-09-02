# UserProfile Component

React компонент для відображення профілю користувача з асинхронним завантаженням даних та покриттям тестами.

## 🚀 Встановлення та запуск

```bash
# Встановлення залежностей
npm install
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom

# Запуск додатку
npm run dev

# Запуск тестів
npm run test:run        # один раз
npm run test           # режим спостереження
```

## 📁 Структура

```
src/
├── components/
│   ├── UserProfile.tsx      # Компонент
│   └── UserProfile.test.tsx # Тести
├── test/
│   ├── setup.ts            # Налаштування тестів
│   └── vitest.d.ts         # TypeScript типи
```

## 🔧 Функціональність

**UserProfile** компонент:
- Виконує асинхронний запит до `https://jsonplaceholder.typicode.com/users/1`
- Відображає індикатор завантаження
- Показує дані користувача (ім'я, email, телефон, веб-сайт)
- Обробляє помилки з можливістю повторного запиту
- Використовує React hooks (useState, useEffect)

## 🧪 Тести

5 тестів покривають всі сценарії:
- Індикатор завантаження
- Успішне відображення даних
- Обробка мережевих помилок
- Обробка HTTP помилок
- Перевірка API викликів

**Технології**: Vitest + React Testing Library + мокування fetch через `vi.stubGlobal()`

## ⚙️ Конфігурація

**vitest.config.ts**:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

**package.json scripts**:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

## 📦 Залежності

- React 18+, TypeScript
- **Dev**: vitest, @testing-library/react, @testing-library/jest-dom, jsdom