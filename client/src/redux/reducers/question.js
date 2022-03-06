/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";

export const fetchQuestions = createAsyncThunk(
  "question/fetchQuestions",
  async (tag) => {
    const answeredQuestions = localStorage.hasOwnProperty("answeredQuestions")
      ? JSON.parse(localStorage.getItem("answeredQuestions"))
      : [];
    const { data } = await axios.put(`/api/questions`, {
      answeredQuestions,
      tag,
      status: "Approved",
    });

    return data;
  }
);

export const submitQuestionByUser = createAsyncThunk(
  "question/submitQuestionByUser",
  async (question) => {
    const { data } = await axios.post("/api/questions", {
      ...question,
      status: "Pending",
    });

    return data;
  }
);

const INIT_STATE = {
  questions: [],
  isLoading: true,
  hasError: false,
  isSubmittedLoading: false,
  hasErrorOnSubmit: false,
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
      })
      .addCase(submitQuestionByUser.pending, (state, action) => {
        state.isSubmittedLoading = true;
        state.hasErrorOnSubmit = false;
      })
      .addCase(submitQuestionByUser.fulfilled, (state, action) => {
        state.isSubmittedLoading = false;
        state.hasErrorOnSubmit = false;
      })
      .addCase(submitQuestionByUser.rejected, (state, action) => {
        state.isSubmittedLoading = false;
        state.hasErrorOnSubmit = true;
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
