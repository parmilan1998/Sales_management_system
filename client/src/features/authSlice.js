import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginAdmin = createAsyncThunk("/user/login", async (data) => {
  const res = await axios.post(`http://localhost:5000/api/v1/user/login`, data);
  console.log({ res });
  localStorage.setItem("token", res.data.token);
  return res.data;
});

export const logOutAdmin = createAsyncThunk("/logout", async () => {
  await axios.post(`http://localhost:5000/api/v1/user/logout`);
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  return {};
});

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state, action) => {
      state.user = null;
    },
  },
});

export default authSlice.reducer;
export const { login, logout } = authSlice.actions;
