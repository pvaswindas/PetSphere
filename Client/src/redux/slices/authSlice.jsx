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
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData(state, action) {
      state.user_data = action.payload.user_data;
      state.isAuthenticated = true;
    },
    setEmail(state, action) {
        state.email = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user_data = null;
        state.isAuthenticated = false;
        state.status = "succeeded";
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setAuthData, setEmail } = authSlice.actions;

export default authSlice.reducer;
