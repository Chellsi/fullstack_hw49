import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import UserProfile from './UserProfile';

// Мокаємо глобальний fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Тестові дані користувача
const mockUser = {
  id: 1,
  name: 'Leanne Graham',
  email: 'Sincere@april.biz',
  phone: '1-770-736-8031 x56442',
  website: 'hildegard.org'
};

describe('UserProfile', () => {
  beforeEach(() => {
    // Очищаємо всі моки перед кожним тестом
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Очищаємо всі моки після кожного тесту
    vi.resetAllMocks();
  });

  it('відображає індикатор завантаження під час виконання запиту', async () => {
    // Мокаємо затримку відповіді
    mockFetch.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve(mockUser)
        }), 100)
      )
    );

    render(<UserProfile />);

    // Перевіряємо, що показується індикатор завантаження
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText('Завантажуємо дані користувача...')).toBeInTheDocument();

    // Чекаємо завершення запиту
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  it('коректно відображає дані користувача після успішного запиту', async () => {
    // Мокаємо успішну відповідь
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUser)
    });

    render(<UserProfile />);

    // Чекаємо завантаження даних
    await waitFor(() => {
      expect(screen.getByTestId('user-data')).toBeInTheDocument();
    });

    // Перевіряємо відображення даних користувача
    expect(screen.getByText('Профіль користувача')).toBeInTheDocument();
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    expect(screen.getByText('Sincere@april.biz')).toBeInTheDocument();
    expect(screen.getByText('1-770-736-8031 x56442')).toBeInTheDocument();
    expect(screen.getByText('hildegard.org')).toBeInTheDocument();
  });

  it('відображає повідомлення про помилку у разі невдалого запиту', async () => {
    // Мокаємо помилку мережі
    mockFetch.mockRejectedValueOnce(new Error('Помилка мережі'));

    render(<UserProfile />);

    // Чекаємо відображення помилки
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    expect(screen.getByText('Помилка: Помилка мережі')).toBeInTheDocument();
    expect(screen.getByText('Спробувати знову')).toBeInTheDocument();
  });

  it('відображає повідомлення про помилку при HTTP помилці', async () => {
    // Мокаємо HTTP помилку (404)
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({})
    });

    render(<UserProfile />);

    // Чекаємо відображення помилки
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    expect(screen.getByText('Помилка: Помилка: 404')).toBeInTheDocument();
  });

  it('правильно викликає API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUser)
    });

    await act(async () => {
      render(<UserProfile />);
    });

    // Чекаємо завершення запиту
    await waitFor(() => {
      expect(screen.getByTestId('user-data')).toBeInTheDocument();
    });

    // Чекаємо що fetch був викликаний з правильним URL
    expect(mockFetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/1');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});