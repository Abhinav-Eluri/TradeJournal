import React from 'react';
import { Routes, Route } from "react-router-dom";
import Register from "../pages/Register.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import CompletedTrades from "../pages/CompletedTrades.jsx";
import OpenPositions from "../pages/OpenPositions.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import History from "../pages/History.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx"; // <--- import it!

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/completed-trades" element={
        <ProtectedRoute>
          <CompletedTrades />
        </ProtectedRoute>
      } />
      <Route path="/openpositions" element={
        <ProtectedRoute>
          <OpenPositions />
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default Routing;
