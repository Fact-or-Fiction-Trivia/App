import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import LogRocket from "logrocket";
import axios from "../axiosInstance";

export const receiveInvitation = createAsyncThunk(
  "auth/receiveInvitation",
  async (inviteId) => {
    const { data } = await axios.get(`/api/invitations?inviteId=${inviteId}`);
    return data.id;
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ password, userId }) => {
    await axios.put(`/auth/password-reset/${userId}`, { password });
  }
);

export const resetLoggedInUsersPassword = createAsyncThunk(
  "auth/resetLoggedInUsersPassword",
  async (password) => {
    const { status } = await axios.put(`/auth/password-reset-logged-in`, {
      password,
    });
    return status;
  }
);

export const requestReset = createAsyncThunk(
  "auth/requestReset",
  async (email, { rejectWithValue }) => {
    const data = await axios.post(`/auth/request-reset`, { email });
    if (data.data.status === 404) {
      return rejectWithValue(data);
    }
    return data;
  }
);

export const receiveToken = createAsyncThunk(
  "auth/receiveToken",
  async (accessToken) => {
    const { data } = await axios.get(`/auth/tokens?accessToken=${accessToken}`);
    return data;
  }
);

export const me = createAsyncThunk(
  "auth/me",
  async (setLongestStreak, { rejectWithValue }) => {
    const { data } = await axios.get("/auth/me", { credentials: "include" });
    setLongestStreak && setLongestStreak(data.maxScore);

    if (data.status === 401) {
      return rejectWithValue(data);
    }
    LogRocket.identify(data.id, {
      email: data.email,
    });

    return data;
  }
);

const maybeSaveLocalStorageStreak = async (streak) => {
  const localStorageStreak =
    localStorage.hasOwnProperty("streak") &&
    JSON.parse(localStorage.getItem("streak"));
  if (localStorageStreak?.length > streak.length) {
    await axios.post(`/api/streaks`, localStorageStreak);
    localStorage.removeItem("streak");
  }
};

export const authenticateWithStreak = createAsyncThunk(
  "auth/authenticateWithStreak",
  async (
    { formData, streak, setError, setLongestStreak, midAuthentication },
    { rejectWithValue }
  ) => {
    try {
      await axios.post(`/auth/login`, formData);
      if (streak.length > 0) {
        await axios.post(`/api/streaks`, streak);
      }
      // if there is another, longer streak in local storage, save that one too
      await maybeSaveLocalStorageStreak(streak);

      const { data } = await axios.get(`/auth/me`);
      setLongestStreak(data.maxScore);
      midAuthentication();
      setError(null);
      return data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      if (err.response.data === "Incorrect email/password") {
        setError({
          message: "Username or password is incorrect.",
        });
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const signupWithStreak = createAsyncThunk(
  "auth/signupWithStreak",
  async (
    { formData, streak, setError, setLongestStreak, midAuthentication },
    { rejectWithValue }
  ) => {
    try {
      await axios.post(`/auth/signup`, { ...formData, points: 1 });
      // grab the most recent streak from the redux store
      if (streak.length > 0) {
        await axios.post(`/api/streaks`, streak);
      }
      // if there is another, longer streak in local storage, save that one too
      await maybeSaveLocalStorageStreak(streak);

      const { data } = await axios.get("/auth/me", { credentials: "include" });

      setLongestStreak(data.maxScore);
      midAuthentication();
      setError(null);
      return data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      if (err.response.data === "Username is already taken") {
        setError({ message: "This username is already taken." });
      } else if (err.response.data === "User already exists") {
        setError({
          message:
            "An account already exists with this email address. Please log in.",
        });
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const reset = createAsyncThunk("auth/reset", async () => {
  await axios.delete("/auth/logout");
});

export const registerInvitation = createAsyncThunk(
  "auth/registerInvitation",
  async (detail) => {
    await axios.put(`/auth/register`, detail);
    const { data } = await axios.get("/auth/me", { credentials: "include" });
    return data;
  }
);

export const changeEmail = createAsyncThunk(
  "auth/changeEmail",
  async ({ userId, email, password }) => {
    await axios.put(`/api/users/changeEmail/${userId}`, { email, password });
  }
);

export const updateUserInfo = createAsyncThunk(
  "auth/updateUser",
  async (updates) => {
    const { data } = await axios.put(`/api/users`, updates);
    return data;
  }
);

export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (updates) => {
    const { data } = await axios.put(`api/users/${updates.id}`, { ...updates });
    return data;
  }
);

const INIT_STATE = {
  auth: {},
  authMessage: null, // Ex. User must be logged in to view this page.
  id: null,
  isLoading: false,
  hasError: false,
  message: null, // Ex. Email or user not found
  validatingToken: true,
  validToken: false,
  resetPasswordSuccessful: false,
  requestedPasswordReset: false,
  loggedIn: false,
  preCheck: false,
  postAuthRedirect: "/",
};
//Slice
/////////////////////////////////////////////////////////////
const authSlice = createSlice({
  name: "auth",
  initialState: INIT_STATE,
  reducers: {
    set(state, action) {
      return { ...state };
    },
    setAuthMessage(state, action) {
      state.authMessage = action.payload;
    },
    setPostAuthRedirect(state, action) {
      state.postAuthRedirect = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(me.fulfilled, (state, action) => {
        state.auth = action.payload;
        state.preCheck = true;
        state.validInvitation = null;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(me.rejected, (state, action) => {
        state.preCheck = true;
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(authenticateWithStreak.fulfilled, (state, action) => {
        state.auth = action.payload;
        state.authMessage = null;
        state.loggedIn = true;
        state.preCheck = true;
        state.validInvitation = null;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(signupWithStreak.fulfilled, (state, action) => {
        state.auth = action.payload;
        state.authMessage = null;
        state.loggedIn = true;
        state.preCheck = true;
        state.validInvitation = null;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(signupWithStreak.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(reset.fulfilled, (state, action) => {
        state = INIT_STATE;
      })
      .addCase(receiveInvitation.fulfilled, (state, action) => {
        state.id = action.payload;
        state.validInvitation = true;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(requestReset.rejected, (state, action) => {
        state.requestedPasswordReset = true;
        state.isLoading = false;
        state.hasError = true;
        state.message = "Email not registered with user account.";
      })
      .addCase(requestReset.pending, (state, action) => {
        state.requestedPasswordReset = true;
        state.isLoading = true;
        state.hasError = false;
        state.message = null;
      })
      .addCase(requestReset.fulfilled, (state, action) => {
        state.requestedPasswordReset = true;
        state.isLoading = false;
        state.hasError = false;
        state.message = "Email has been sent.";
      })
      .addCase(receiveToken.pending, (state, action) => {
        state.validatingToken = true;
        state.validToken = false;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(receiveToken.fulfilled, (state, action) => {
        state.validatingToken = false;
        state.id = action.payload;
        state.validToken = true;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(receiveToken.rejected, (state, action) => {
        state.validatingToken = false;
        state.validToken = false;
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordSuccessful = true;
        state.isLoading = false;
        state.hasError = false;
        state.message = "Password has been reset.";
      })
      .addCase(resetPassword.pending, (state, action) => {
        state.resetPasswordSuccessful = true;
        state.isLoading = true;
        state.hasError = false;
        state.message = null;
      })
      .addCase(changeEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.message = "Password Incorrect.";
      })
      .addCase(changeEmail.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
        state.message = null;
      })
      .addCase(changeEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.message = "Email has been reset.";
      })
      .addCase(updateUserInfo.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.auth = action.payload;
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.auth = {};
        state.isLoading = false;
        state.hasError = false;
      });
  },
});

//Actions
/////////////////////////////////////////////////////////////
export const { set, setAuthMessage, setPostAuthRedirect, updateMe } =
  authSlice.actions;

//Reducer
/////////////////////////////////////////////////////////////
export default authSlice.reducer;

//Selectors
/////////////////////////////////////////////////////////////
export const selectAuth = (state) => state.auth.auth;
