import React, { useState, useEffect } from 'react';
import { resetPassword } from '../api/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "../utils/toastService.js";


const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // Get the email and OTP from URL query params
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const otp = queryParams.get('otp');

    // Handle password reset
    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            // Call API to reset password with the provided email, OTP, and new password
            await resetPassword(email, otp, newPassword);
            setMessage("Password reset successful! You can now log in.");
            toast("Password reset successful! You can now log in.", "success");

            setTimeout(() => navigate('/login'), 2000); // Redirect to login after success
        } catch (error) {
            setMessage("Invalid OTP or error resetting password.");
            toast("Invalid OTP or error resetting password.", "error");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center text-gray-700">Reset Password</h2>
                <p className="text-sm text-gray-600 text-center mt-2">
                    Enter a new password for your account.
                </p>
                <form onSubmit={handleResetPassword} className="mt-4">
                    <div className="mt-4">
                        <label className="block text-sm text-gray-600">New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-green-700 transition"
                    >
                        Reset Password
                    </button>
                </form>
                {message && <p className="text-center text-green-600 mt-2">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
