import React, { useState } from 'react';
import { registerUser } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import Loading from "../components/Loading.jsx";
import {toast} from "../utils/toastService.js";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerUser(username, email, password);
            alert("Registration successful! You can now log in.");
            toast("Registration successful!", "success");
            navigate('/login');
        } catch (error) {
            console.log(error);
            toast("Registration not Successful!", "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-4">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  Register
              </h2>
              <form onSubmit={handleRegister} className="space-y-5">
                  <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                          Username
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-900"
                      />
                  </div>
                  <div>
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
                      />
                  </div>
                  <div>
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
                      />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                      Register
                  </button>
              </form>
              <p className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-blue-600 hover:underline">
                      Login
                  </Link>
              </p>
          </div>
      </div>
    );
};

export default Register;
