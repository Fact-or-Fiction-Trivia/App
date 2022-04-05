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

export const updateAdminQuestion = createAsyncThunk(
  "admin/updateAdminQuestion",
  async ({ questionId, body }) => {
    const { data } = await axios.put(
      `/api/admins/questions/${questionId}`,
      body
    );
    return data;
  }
);

export const createQuestion = createAsyncThunk(
  "admin/createQuestion",
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
  question: {},
  isLoading: true,
  hasError: false,
};
//Slice
/////////////////////////////////////////////////////////////
const adminSlice = createSlice({
  name: "admin",
  initialState: INIT_STATE,
  reducers: {
    setNew(state, action) {
      return { ...state };
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
      });
  },
});

//Actions
/////////////////////////////////////////////////////////////
export const { setNew } = adminSlice.actions;

//Reducer
/////////////////////////////////////////////////////////////
export default adminSlice.reducer;

//Selectors
/////////////////////////////////////////////////////////////
export const selectAdmin = (state) => state.admin;
