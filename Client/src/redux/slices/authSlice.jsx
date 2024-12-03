import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosinstance";

export const logout = createAsyncThunk("accounts/logout", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.post("accounts/logout");
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
  }
});

const initialState = {
  user_data: null,
  email: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData(state, action) {
      state.user_data = action.payload.user_data
      state.isAuthenticated = true
    },
    setEmail(state, action) {
        state.email = action.payload.email
    },
    setError(state, action) {
      state.error = action.payload.error;
    },
    clearAuth(state, action) {
      state.user_data = null
      state.isAuthenticated = false
      state.email = null
    },
  },
});

export const { setAuthData, setEmail, setError, clearAuth } = authSlice.actions;

export default authSlice.reducer;
