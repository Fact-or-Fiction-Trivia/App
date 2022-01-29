/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";

export const createStreak = createAsyncThunk(
  "streak/createStreak",
  async (answeredQuestions) => {
    const { data } = await axios.post(`/api/streaks`, answeredQuestions);

    return data;
  }
);

export const getMaxStreakForUser = createAsyncThunk(
  "streak/getMaxStreakForUser",
  async () => {
    const { data } = await axios.get(`/api/streaks/`);
    return data;
  }
);

const INIT_STATE = {
  streaks: [],
  maxStreak: 0,
  isLoading: false,
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
    setMaxScore(state, action) {
      return { ...state, maxStreak: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStreak.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(createStreak.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(createStreak.rejected, (state, action) => {
        state = INIT_STATE;
      })
      .addCase(getMaxStreakForUser.pending, (state, action) => {
        state.hasError = false;
        state.isLoading = true;
      })
      .addCase(getMaxStreakForUser.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
      })
      .addCase(getMaxStreakForUser.fulfilled, (state, action) => {
        state.maxStreak = action.payload;
        state.hasError = false;
        state.isLoading = false;
      });
  },
});

//Actions
/////////////////////////////////////////////////////////////
export const { setNew, setMaxScore } = streakSlice.actions;

//Reducer
/////////////////////////////////////////////////////////////
export default streakSlice.reducer;

//Selectors
/////////////////////////////////////////////////////////////
export const selectQuestion = (state) => state.streak;
