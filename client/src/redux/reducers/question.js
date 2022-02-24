/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
import axios from "../axiosInstance";

export const fetchQuestions = createAsyncThunk(
  "question/fetchQuestions",
  async () => {
    const answeredQuestions = localStorage.hasOwnProperty("answeredQuestions")
      ? JSON.parse(localStorage.getItem("answeredQuestions"))
      : [];
    const { data } = await axios.put(`/api/questions`, answeredQuestions);

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
      if (localStorage.hasOwnProperty("answeredQuestions")) {
        const answeredQuestions = JSON.parse(
          localStorage.getItem("answeredQuestions")
        );
        localStorage.setItem(
          "answeredQuestions",
          JSON.stringify({
            ...answeredQuestions,
            [questionId]: true,
          })
        );
      } else {
        localStorage.setItem(
          "answeredQuestions",
          JSON.stringify({
            [questionId]: true,
          })
        );
      }
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
