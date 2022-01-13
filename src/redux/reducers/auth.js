import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import history from "../../utils/history";

export const receiveInvitation = createAsyncThunk(
  "auth/receiveInvitation",
  async (inviteId) => {
    const { data } = await axios.get(`/api/invitations?inviteId=${inviteId}`);
    return data.id;
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ password, userId, token }) => {
    const { data } = await axios.post(
      `/api/users/password-reset/${userId}/${token}`,
      { password }
    );
    if (data === "reset") {
      alert("Password has been reset");
      history.push("/");
    } else {
      alert("err");
    }
    return data;
  }
);

export const requestReset = createAsyncThunk(
  "auth/requestReset",
  async ({ email }) => {
    const { data } = await axios.post(`/api/users/request-reset`, { email });
    if (data === "sent") {
      alert("sent");
      history.push("/");
    } else {
      alert("err");
    }
    return data;
  }
);

export const me = createAsyncThunk("auth/me", async () => {
  const { data } = await axios.get("/auth/me", { credentials: "include" });
  return data;
});

export const authenticate = createAsyncThunk(
  "auth/authenticate",
  async ({ email, password }) => {
    await axios.post(`/auth/login`, { email, password });
    const { data } = await axios.get("/auth/me", { credentials: "include" });
    // history.push("/");
    return data;
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

const INIT_STATE = {
  auth: { permissions: [] },
  id: null,
  validInvitation: null,
  loggedIn: false,
  preCheck: false,
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
      .addCase(authenticate.fulfilled, (state, action) => {
        state.auth = action.payload;
        state.preCheck = true;
        state.validInvitation = null;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(authenticate.rejected, (state, action) => {
        state = INIT_STATE;
        alert("Incorrect Email and/or Password");
      })
      .addCase(reset.fulfilled, (state, action) => {
        state = INIT_STATE;
      })
      .addCase(receiveInvitation.fulfilled, (state, action) => {
        state.id = action.payload;
        state.validInvitation = true;
        state.isLoading = false;
        state.hasError = false;
        // history.push("/");
      })
      .addCase(receiveInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(registerInvitation.fulfilled, (state, action) => {
        state.auth = action.payload;
        state.validInvitation = null;
        state.preCheck = true;
        state.isLoading = false;
        state.hasError = false;
        window.location.reload();
      })
      .addCase(registerInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(changeEmail.rejected, (state, action) => {
        alert("Password Incorrect");
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(changeEmail.fulfilled, (state, action) => {
        alert("Email has been reset");
        state.isLoading = false;
        state.hasError = false;
      });
  },
});

//Actions
/////////////////////////////////////////////////////////////
export const { set } = authSlice.actions;

//Reducer
/////////////////////////////////////////////////////////////
export default authSlice.reducer;

//Selectors
/////////////////////////////////////////////////////////////
export const selectAuth = (state) => state.auth.auth;
