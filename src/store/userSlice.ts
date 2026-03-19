import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface User {
  fname: string;
  lname?: string;
  email: string;
  pass: string;
  role: "user" | "admin";
  createdAt?: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

const initialState: UserState = {
  user: null,
  loading: false,
  initialized: false,
};

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async () => {
    const response = await fetch(`${backendUrl}/api/auth/user`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch current user");
    }

    const data = await response.json();
    return (data.ok ? data.user ?? null : null) as User | null;
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.initialized = true;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.initialized = true;
      });
  },
});

export const { clearUser, setUser } = userSlice.actions;

export default userSlice.reducer;
