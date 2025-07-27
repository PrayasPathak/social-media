import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("access_token") || null,
  isAuthenticated: !!localStorage.getItem("access_token"),
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("access_token", action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("access_token");
    },
  },
});

export const { setAuthUser, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
