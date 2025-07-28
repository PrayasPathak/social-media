import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: !!localStorage.getItem("access_token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
  },
});

export const { setAuthUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
