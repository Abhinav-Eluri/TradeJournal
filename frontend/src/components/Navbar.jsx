import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../api/api.js";
import { logout } from "../store/authSlice.js";
import {toast} from "../utils/toastService.js";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, refreshToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser({ refresh: refreshToken })
      .then(() => {
        dispatch(logout());
        toast("Logout successfully.", "success");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast("Logout failed. Please try again.", "error");
      });
  };

  return (
    <nav className="w-full h-20 px-4 flex items-center justify-between bg-white shadow-md fixed top-0 z-50">
      {/* Left - Logo and Links */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="text-xl font-bold text-blue-600">
          <Link to="/">Trade Journal</Link>
        </div>

        {/* Main Navigation Links */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-gray-700 font-medium hover:text-blue-500">Home</Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="text-gray-700 font-medium hover:text-blue-500">Dashboard</Link>
              <Link to="/completed-trades" className="text-gray-700 font-medium hover:text-blue-500">Completed Trades</Link>
              <Link to="/openpositions" className="text-gray-700 font-medium hover:text-blue-500">Open Positions</Link>
              <Link to="/history" className="text-gray-700 font-medium hover:text-blue-500">History</Link>
            </>
          )}
        </div>
      </div>

      {/* Right - Auth Links */}
      <div className="hidden md:flex gap-4 items-center">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="text-gray-700 hover:text-red-500">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-500">Register</Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-md md:hidden flex flex-col items-center gap-4 py-4">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
              <Link to="/completed-trades" onClick={() => setIsOpen(false)}>Completed Trades</Link>
              <Link to="/openpositions" onClick={() => setIsOpen(false)}>Open Positions</Link>
              <Link to="/history" onClick={() => setIsOpen(false)}>History</Link>
            </>
          )}
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="text-gray-700 hover:text-red-500"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
