import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";

export const fetchProfile = createAsyncThunk(
  "contestedQuestion/createContestedQuestion",
  async (userId) => {
    const { data } = await axios.get(`/api/profiles/${userId}`);

    return data;
  }
);

const INIT_STATE = {
  profile: {},
  isLoading: false,
  hasError: false,
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
      });
  },
});

//Reducer
/////////////////////////////////////////////////////////////
export default profileSlice.reducer;
