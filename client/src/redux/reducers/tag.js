import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";

export const getTags = createAsyncThunk("tags/getTags", async () => {
  const { data } = await axios.get("/api/tags");
  return data;
});

const INIT_STATE = {
  isLoading: false,
  hasError: false,
  tags: [],
};

const tagSlice = createSlice({
  name: "tag",
  initialState: INIT_STATE,
  extraReducers: (builder) => {
    builder
      .addCase(getTags.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.tags = [...action.payload];
      })
      .addCase(getTags.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export default tagSlice.reducer;
