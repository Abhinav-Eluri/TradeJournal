import React, { useState } from 'react';
import { forgotPassword, verifyOTP } from '../api/api';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from "../utils/toastService.js";


const ForgotPassword = () => {
    const [stage, setStage] = useState(1); // 1: email, 2: otp
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();


    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            setMessage("OTP sent to your email.");
            setStage(2);
        } catch (error) {
            setMessage("Error sending OTP. Try again.");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await verifyOTP(email, otp);
            setMessage("OTP verified! Redirecting to reset password...");
            toast("OTP verified successfully!", "success");

            // Redirect to reset password page or store userId in state
            // For example:
            navigate(`/reset-password?email=${email}&otp=${otp}`);
        } catch (error) {
            setMessage("Invalid OTP. Please try again.");
            toast("Invalid OTP. Please try again.", "error");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center text-gray-700">Forgot Password</h2>
                <p className="text-sm text-gray-600 text-center mt-2">
                    {stage === 1
                        ? "Enter your email to receive a password reset OTP."
                        : "Enter the OTP sent to your email."}
                </p>

                <form onSubmit={stage === 1 ? handleSendOtp : handleVerifyOtp} className="mt-4">
                    {stage === 1 && (
                        <div>
                            <label className="block text-sm text-gray-600">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                    )}

                    {stage === 2 && (
                        <div>
                            <label className="block text-sm text-gray-600">OTP</label>
                            <input
                                type="text"
                                placeholder="Enter the 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-700 transition"
                    >
                        {stage === 1 ? "Send OTP" : "Verify OTP"}
                    </button>
                </form>

                {message && <p className="text-center text-green-600 mt-2">{message}</p>}

                <p className="text-center text-sm text-gray-600 mt-4">
                    Remembered your password?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
