/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
import axios from "../axiosInstance";

export const fetchQuestions = createAsyncThunk(
  "question/fetchQuestions",
  async () => {
    const { data } = await axios.get(`/api/questions`);

    return data;
  }
);

const INIT_STATE = {
  questions: [],
  isLoading: true,
  hasError: false,
};
//Slice
/////////////////////////////////////////////////////////////
const questionSlice = createSlice({
  name: "question",
  initialState: INIT_STATE,
  reducers: {
    setNew(state, action) {
      return { ...state };
    },
    clearAnswer(state, action) {
      const questionId = action.payload;
      const questions = state.questions.filter(
        (question) => question.id !== questionId
      );
      return { ...state, questions };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state = INIT_STATE;
      });
  },
});

//Actions
/////////////////////////////////////////////////////////////
export const { setNew, clearAnswer } = questionSlice.actions;

//Reducer
/////////////////////////////////////////////////////////////
export default questionSlice.reducer;

//Selectors
/////////////////////////////////////////////////////////////
export const selectQuestion = (state) => state.question;
