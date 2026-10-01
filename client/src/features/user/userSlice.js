
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";
import toast from "react-hot-toast";

// =========================
// INITIAL STATE
// =========================

const initialState = {
  value: null,
  loading: false,
  updating: false,
};

// =========================
// FETCH USER
// =========================

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data.success || !data.user) {
        return rejectWithValue(data.message || "User not found");
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// =========================
// UPDATE USER
// =========================

export const updateUser = createAsyncThunk(
  "user/update",
  async ({ userData, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/api/user/update",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data.success || !data.user) {
        return rejectWithValue(
          data.message || "Updated user data not received"
        );
      }

      return data.user;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile"
      );
    }
  }
);

// =========================
// USER SLICE
// =========================

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH USER
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload;
      })

      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
      })

      // UPDATE USER
      .addCase(updateUser.pending, (state) => {
        state.updating = true;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.updating = false;
        state.value = action.payload;
      })

      .addCase(updateUser.rejected, (state) => {
        state.updating = false;
      });
  },
});

export default userSlice.reducer;
