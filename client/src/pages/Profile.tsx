import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { AxiosError } from 'axios';

interface User {
  username: string;
  email: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get<{ success: boolean; data: User }>(
          '/currentUser',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data.data);
      } catch (err: unknown) {
        if ((err as AxiosError).isAxiosError) {
          navigate('/login');
        } else {
          navigate('/login');
        }
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <button
        onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
