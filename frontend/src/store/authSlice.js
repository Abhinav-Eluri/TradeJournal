import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem("token") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user")) || null,
    authLoaded: false, // ✅ added
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.access;
            state.refreshToken = action.payload.refresh;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.authLoaded = true; // ✅ ensure this is true after login

            localStorage.setItem("token", action.payload.access);
            localStorage.setItem("refreshToken", action.payload.refresh);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.user = null;
            state.authLoaded = false;

            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        },
        refreshTokenSuccess: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
        setAuthLoaded: (state, action) => {
            state.authLoaded = action.payload;
        },
    },
});

export const { loginSuccess, logout, refreshTokenSuccess, setAuthLoaded } = authSlice.actions;
export default authSlice.reducer;
