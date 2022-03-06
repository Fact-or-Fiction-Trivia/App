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
  isLoading: false,
  hasError: false,
};

const contestedQuestionSlice = createSlice({
  name: "contestedQuestion",
  initialState: INIT_STATE,
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

//Reducer
/////////////////////////////////////////////////////////////
export default contestedQuestionSlice.reducer;
