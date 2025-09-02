import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
      
      if (!response.ok) {
        throw new Error(`Помилка: ${response.status}`);
      }
      
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Сталася невідома помилка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="user-profile" data-testid="loading">
        <p>Завантажуємо дані користувача...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile" data-testid="error">
        <p style={{ color: 'red' }}>Помилка: {error}</p>
        <button onClick={fetchUser}>Спробувати знову</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile">
        <p>Немає даних користувача</p>
      </div>
    );
  }

  return (
    <div className="user-profile" data-testid="user-data">
      <h2>Профіль користувача</h2>
      <div>
        <p><strong>Ім'я:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Телефон:</strong> {user.phone}</p>
        <p><strong>Веб-сайт:</strong> {user.website}</p>
      </div>
    </div>
  );
};

export default UserProfile;