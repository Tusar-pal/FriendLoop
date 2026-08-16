import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";
import toast from "react-hot-toast";

const initialState = {
  value: null,
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

      console.log("USER API RESPONSE:", data);

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data.user;
    } catch (error) {
      console.log(
        "FETCH USER ERROR:",
        error.response?.data || error.message
      );

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

      console.log("UPDATE USER RESPONSE:", data);

      if (!data.success) {
        toast.error(data.message);
        return rejectWithValue(data.message);
      }

      toast.success(data.message);

      // Important:
      // Backend updated user return করছে
      return data.user;

    } catch (error) {
      console.log(
        "UPDATE USER ERROR:",
        error.response?.data || error.message
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";

      toast.error(message);

      return rejectWithValue(message);
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
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.value = action.payload;
      })

      .addCase(fetchUser.rejected, (state) => {
        state.value = null;
      })

      // UPDATE USER
      .addCase(updateUser.fulfilled, (state, action) => {
        console.log("REDUX UPDATED USER:", action.payload);

        state.value = action.payload;
      });
  },
});

export default userSlice.reducer;