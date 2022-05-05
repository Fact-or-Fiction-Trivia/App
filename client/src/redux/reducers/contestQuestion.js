import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";

export const createContestedQuestion = createAsyncThunk(
  "contestedQuestion/createContestedQuestion",
  async (contestedQuestion) => {
    const { data } = await axios.post(
      `/api/contestQuestion`,
      contestedQuestion
    );

    return data;
  }
);

const INIT_STATE = {
  midContest: false,
  isLoading: false,
  hasError: false,
};

const contestedQuestionSlice = createSlice({
  name: "contestedQuestion",
  initialState: INIT_STATE,
  reducers: {
    midContestedQuestion(state, action) {
      return { ...state, midContest: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createContestedQuestion.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(createContestedQuestion.fulfilled, (state) => {
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(createContestedQuestion.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

//Actions
/////////////////////////////////////////////////////////////
export const { midContestedQuestion } = contestedQuestionSlice.actions;

//Reducer
/////////////////////////////////////////////////////////////
export default contestedQuestionSlice.reducer;
