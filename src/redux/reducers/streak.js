/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import history from "../../utils/history";

export const createStreak = createAsyncThunk(
  "streak/createStreak",
  async (body) => {
    const { data } = await axios.post(`/api/streaks`, body);

    return data;
  }
);

const INIT_STATE = {
  streaks: [],
  isLoading: true,
  hasError: false,
};
//Slice
/////////////////////////////////////////////////////////////
const streakSlice = createSlice({
  name: "streak",
  initialState: INIT_STATE,
  reducers: {
    setNew(state, action) {
      return { ...state };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStreak.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(createStreak.fulfilled, (state, action) => {
        state.streaks = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(createStreak.rejected, (state, action) => {
        state = INIT_STATE;
      });
  },
});

//Actions
/////////////////////////////////////////////////////////////
export const { setNew } = streakSlice.actions;

//Reducer
/////////////////////////////////////////////////////////////
export default streakSlice.reducer;

//Selectors
/////////////////////////////////////////////////////////////
export const selectQuestion = (state) => state.streak;
