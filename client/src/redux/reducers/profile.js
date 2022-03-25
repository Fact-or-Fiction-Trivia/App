import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId) => {
    const { data } = await axios.get(`/api/profiles/${userId}`);

    return data;
  }
);

export const getAllStreaksForUser = createAsyncThunk(
  "streak/getAllStreaksForUser",
  async (id) => {
    const { data } = await axios.get(`/api/streaks/all-scores/${id}`);
    return data;
  }
);

export const getMailchimpStatus = createAsyncThunk(
  "mailchimp/getMailchimpStatus",
  async (mailchimpId) => {
    const { data } = await axios.get(`/api/mailchimp/${mailchimpId}`);
    return data;
  }
);

export const updateMailchimpStatus = createAsyncThunk(
  "mailchimp/updateMailchimpStatus",
  async ({ mailchimpId, update }) => {
    const { data } = await axios.patch(`/api/mailchimp/${mailchimpId}`, {
      update,
    });
    return data;
  }
);

export const subscribeToEmails = createAsyncThunk(
  "mailchimp/subscribe",
  async (email) => {
    const { data } = await axios.post(`/api/mailchimp`, {
      status: "subscribed",
      email,
    });
    return data;
  }
);

const INIT_STATE = {
  profile: {},
  isLoading: false,
  hasError: false,
  scores: {},
  mailchimpStatus: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: INIT_STATE,
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(getAllStreaksForUser.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getAllStreaksForUser.fulfilled, (state, action) => {
        state.scores = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getAllStreaksForUser.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(getMailchimpStatus.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getMailchimpStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.mailchimpStatus = action.payload;
      })
      .addCase(getMailchimpStatus.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(updateMailchimpStatus.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(updateMailchimpStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.mailchimpStatus = action.payload;
      })
      .addCase(updateMailchimpStatus.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(subscribeToEmails.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(subscribeToEmails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.mailchimpStatus = action.payload;
      })
      .addCase(subscribeToEmails.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

//Reducer
/////////////////////////////////////////////////////////////
export default profileSlice.reducer;
