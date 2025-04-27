import axios from 'axios';
import store from '../store/store.js';
import { logout, refreshTokenSuccess } from '../store/authSlice';

//const API_URL = "http://localhost:8000";
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" }
});

// Request Interceptor to add Access Token
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor to Handle Token Expiry
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const state = store.getState();
                const refreshToken = state.auth.refreshToken;
                if (!refreshToken) {
                    store.dispatch(logout());
                    return Promise.reject(error);
                }

                const response = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh: refreshToken });
                store.dispatch(refreshTokenSuccess(response.data.access));

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return api(originalRequest);
            } catch (refreshError) {
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);



export const loginUser = async (email, password) => {
    const response = await api.post("/auth/login/", { email, password });
    return response.data;
};

export const registerUser = async (username, email, password) => {
    await api.post("/auth/register/", { username, email, password });
};

export const forgotPassword = async (email) => {
    await api.post("/auth/forgot-password/", { email });
};

export const verifyOTP = async (email, otp) => {
    const response = await api.post("/auth/verify-otp/", { email, otp });
    return response.data;
}

export const resetPassword = async (email, otp, newPassword) => {
    await api.post("/auth/reset-password/", { email, otp, new_password: newPassword });
};

export const logoutUser = async (refreshToken) => {
    await api.post("/auth/logout/", refreshToken);
};

export const createOrder = async (orderData) => {
    const response = await api.post("/api/orders/", orderData);
    return response.data;
};

export const fetchOrders = async () => {
    const response = await api.get("/api/orders/");
    return response.data;
};

export const closeTrade = async (orderId, data) => {
    const response = await api.post(`/api/orders/${orderId}/close/`, data);
    return response.data;
};

export const fetchCompletedTrades = async () => {
    const response = await api.get("/api/completed-trades/");
    return response.data;
};

export const fetchOpenPositions = async () => {
    const response = await api.get("/api/open-positions/");
    return response.data;
};

export const addDeposit = async (amount) => {
    const response = await api.post("/api/deposits/", { amount });
    return response.data;
};

export const fetchDepositHistory = async () => {
    const response = await api.get("/api/deposits/");
    return response.data;
};

export const fetchUserData = async (userId) => {
    const response = await api.get(`/api/users/${userId}/`);
    return response.data;
};

export const updateOrderComment = async (orderId, comment) => {
    const response = await api.patch(`/api/orders/${orderId}/`, { comment });
    return response.data;
};

export const updateCompletedTradeNote = async (tradeId, note) => {
    const response = await api.patch(`/api/completed-trades/${tradeId}/`, { note });
    return response.data;
};


export default api;
