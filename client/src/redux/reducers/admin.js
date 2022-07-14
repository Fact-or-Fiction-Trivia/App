/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";

export const fetchAdminQuestions = createAsyncThunk(
  "admin/fetchAdminQuestions",
  async () => {
    const { data } = await axios.get(`/api/admins/questions`);

    return data;
  }
);

export const fetchAdminQuestion = createAsyncThunk(
  "admin/fetchAdminQuestion",
  async ({ questionId, cb }) => {
    const { data } = await axios.get(`/api/admins/questions/${questionId}`);
    cb && cb(data);
    return data;
  }
);

export const fetchAdminQuestionsToReview = createAsyncThunk(
  "admin/fetchAdminQuestionsToReview",
  async (cb) => {
    const { data } = await axios.get(`/api/admins/questions?status=Pending`);
    cb && data[0] && cb(data[0]); // setting the first question as active reivew question
    return data;
  }
);

export const fetchAdminContestedQuestions = createAsyncThunk(
  "admin/fetchAdminContestedQuestions",
  async (cb) => {
    const { data } = await axios.get(`/api/admins/contested-questions`);
    cb && data[0] && cb(data[0]); // setting the first question as active reivew question
    return data;
  }
);

export const updateContestedQuestions = createAsyncThunk(
  "admin/updateContestedQuestions",
  async ({ contestedQuestionId, status, questionIdx }) => {
    await axios.put(`/api/admins/contested-questions/${contestedQuestionId}`, {
      status,
    });

    return questionIdx;
  }
);

export const updateAdminQuestion = createAsyncThunk(
  "admin/updateAdminQuestion",
  async ({ questionId, body, cb }) => {
    const { data } = await axios.put(
      `/api/admins/questions/${questionId}`,
      body
    );
    cb && cb(data);
    return data;
  }
);

export const createAdminQuestion = createAsyncThunk(
  "admin/createAdminQuestion",
  async (body) => {
    const { data } = await axios.post("/api/admins/questions", body);

    return data;
  }
);

export const getPendingQuestionCount = createAsyncThunk(
  "admin/getPendingQuestionCount",
  async () => {
    const { data } = await axios.get(`/api/admins/review_count`);
    return data;
  }
);

const INIT_STATE = {
  questions: [],
  question: {},
  questionsToReview: [],
  contestedQuestions: [],
  isLoading: true,
  hasError: false,
  pendingQuestionCount: 0,
  pendingQuestionCountLoading: false,
};
//Slice
/////////////////////////////////////////////////////////////
const adminSlice = createSlice({
  name: "admin",
  initialState: INIT_STATE,
  reducers: {
    skipContestedQuestion(state, action) {
      const newQuestions = [...state.contestedQuestions];
      newQuestions.push(newQuestions.shift());
      return { ...state, contestedQuestions: newQuestions };
    },
    skipSubmittedQuestion(state) {
      const newQuestions = [...state.questionsToReview];
      newQuestions.push(newQuestions.shift());
      return { ...state, questionsToReview: newQuestions };
    },
    removeSubmittedQuestion(state) {
      // remove a question from the queue when it is accepted or rejected
      const newQuestions = [...state.questionsToReview];
      newQuestions.shift();
      return { ...state, questionsToReview: newQuestions };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminQuestions.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchAdminQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(fetchAdminQuestions.rejected, (state, action) => {
        state = INIT_STATE;
      })
      .addCase(fetchAdminQuestion.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchAdminQuestion.fulfilled, (state, action) => {
        state.question = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(fetchAdminQuestion.rejected, (state, action) => {
        state = INIT_STATE;
      })
      .addCase(fetchAdminQuestionsToReview.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchAdminQuestionsToReview.fulfilled, (state, action) => {
        state.questionsToReview = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(fetchAdminQuestionsToReview.rejected, (state, action) => {
        state = INIT_STATE;
      })
      .addCase(fetchAdminContestedQuestions.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchAdminContestedQuestions.fulfilled, (state, action) => {
        state.contestedQuestions = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(fetchAdminContestedQuestions.rejected, (state, action) => {
        state = INIT_STATE;
      })
      .addCase(updateContestedQuestions.fulfilled, (state, action) => {
        const questionIdx = action.payload;

        state.contestedQuestions = state.contestedQuestions.filter(
          (_, idx) => idx !== questionIdx
        );
        state.isLoading = false;
        state.hasError = false;
      })

      .addCase(updateAdminQuestion.fulfilled, (state, action) => {
        state.question = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getPendingQuestionCount.pending, (state, action) => {
        state.pendingQuestionCountLoading = true;
      })
      .addCase(getPendingQuestionCount.fulfilled, (state, action) => {
        state.pendingQuestionCountLoading = false;
        state.pendingQuestionCount = action.payload;
      });
  },
});

//Actions
/////////////////////////////////////////////////////////////
export const {
  setNew,
  removeSubmittedQuestion,
  skipContestedQuestion,
  skipSubmittedQuestion,
} = adminSlice.actions;

//Reducer
/////////////////////////////////////////////////////////////
export default adminSlice.reducer;

//Selectors
/////////////////////////////////////////////////////////////
export const selectAdmin = (state) => state.admin;
