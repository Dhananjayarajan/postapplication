import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import type { AxiosError } from 'axios';

interface SignupForm {
  username: string;
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

const Signup: React.FC = () => {
  const [form, setForm] = useState<SignupForm>({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<ApiResponse>('/signup', form);
      if (res.data.success) {
        alert('Signup successful! Please login.');
        navigate('/login');
      }
    } catch (err: unknown) {
      if ((err as AxiosError).isAxiosError) {
        const axiosErr = err as AxiosError<{ message: string }>;
        setError(axiosErr.response?.data.message || 'Something went wrong');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded">
          Signup
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{' '}
        <Link className="text-blue-500" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
