import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";

export const fetchProfile = createAsyncThunk(
  "contestedQuestion/createContestedQuestion",
  async (userId) => {
    const { data } = await axios.get(`/api/profiles/${userId}`);

    return data;
  }
);

export const getAllStreaksForUser = createAsyncThunk(
  "streak/getAllStreaksForUser",
  async (id) => {
    const { data } = await axios.get(`/api/streaks/all-scores/${id}`);
    return data;
  }
);

const INIT_STATE = {
  profile: {},
  isLoading: false,
  hasError: false,
  scores: {},
};

const profileSlice = createSlice({
  name: "profile",
  initialState: INIT_STATE,
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(getAllStreaksForUser.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getAllStreaksForUser.fulfilled, (state, action) => {
        state.scores = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getAllStreaksForUser.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

//Reducer
/////////////////////////////////////////////////////////////
export default profileSlice.reducer;
