import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-surface p-8 rounded-lg shadow-lg border border-gray-800 card">
      <h2 className="text-3xl font-bold text-primary mb-6 text-center">Welcome Back</h2>
      {error && <div className="bg-error text-white p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-text-secondary mb-2">Email Address</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>
        <div className="mb-6">
          <label className="block text-text-secondary mb-2">Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="btn-primary w-full"
        >
          Sign In
        </button>
      </form>
      <div className="my-4 flex items-center">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="mx-4 text-text-secondary">or</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
      >
        <FcGoogle className="text-xl" />
        <span>Sign in with Google</span>
      </button>
      <div className="mt-4 text-center text-text-secondary">
        New Customer?{' '}
        <Link to="/register" className="text-primary hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;