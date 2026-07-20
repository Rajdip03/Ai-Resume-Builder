import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
        loading: false,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user; // stores user data
            state.token = action.payload.token; // stores user token data
        },
        logout: (state) => {
            state.user = null;
            state.token = '';
            localStorage.removeItem('token')
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;