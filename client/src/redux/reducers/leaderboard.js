import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";

export const getAllStreaks = createAsyncThunk(
  "leaderboard/getAllStreaks",
  async () => {
    const { data } = await axios.get(`/api/streaks/all-scores`);
    return data;
  }
);

const INIT_STATE = {
  allTime: [],
  monthly: [],
  weekly: [],
};

const streakSlice = createSlice({
  name: "streak",
  initialState: INIT_STATE,
  extraReducers: (builder) => {
    builder
      .addCase(getAllStreaks.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getAllStreaks.fulfilled, (state, action) => {
        state.allTime = action.payload.allTime;
        state.hasError = false;
        state.isLoading = false;
        state.monthly = action.payload.monthly;
        state.teamScores = action.payload.teamScores;
        state.weekly = action.payload.weekly;
      })
      .addCase(getAllStreaks.rejected, (state, action) => {
        state = INIT_STATE;
      });
  },
});

//Actions
/////////////////////////////////////////////////////////////

//Reducer
/////////////////////////////////////////////////////////////
export default streakSlice.reducer;

//Selectors
/////////////////////////////////////////////////////////////
