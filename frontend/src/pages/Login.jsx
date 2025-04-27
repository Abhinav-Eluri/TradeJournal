import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { loginUser } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import Loading from "../components/Loading.jsx";
import { toast } from "../utils/toastService";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await loginUser(email, password);
            dispatch(loginSuccess(data));
            toast("Login successful!", "success");
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.message || "Invalid credentials or server error.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md mx-4">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  Login
              </h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
              )}
              <form onSubmit={handleLogin}>
                  <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                          Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-900"
                        aria-label="Email address"
                      />
                  </div>
                  <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                          Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-900"
                        aria-label="Password"
                      />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                      Login
                  </button>
              </form>
              <div className="text-center mt-4">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                      Forgot Password?
                  </Link>
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:underline"
                  >
                      Register
                  </Link>
              </p>
          </div>
      </div>
    );
};

export default Login;
