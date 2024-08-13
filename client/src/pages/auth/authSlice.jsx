import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Login,
  Signup,
  logout,
  emailVerification,
  ResendVerificationCode,
  GetLoginUser,
  resetPasswordRequest,
  resetPassword,
  verifyCode,
  updateUser,
} from "./authApi";

const initialState = {
  user: null,
  userInfo: null,
  isVerified: false,
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMessage: null,
};

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      const response = await Signup(user);
      return response;
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === "User already registered"
      ) {
        return thunkAPI.rejectWithValue("User already registered");
      } else {
        throw error;
      }
    }
  }
);

// Login user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    const response = await Login(user);
    return response;
  } catch (error) {
    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data.error === "User is not verified"
    ) {
      return thunkAPI.rejectWithValue("User is not verified");
    } else {
      throw error;
    }
  }
});

export const Logout = createAsyncThunk("auth/logout", async () => {
  const response = await logout();
  return response.data;
});

export const emailVerificationAsync = createAsyncThunk(
  "user/emailVerification",
  async (data, { rejectWithValue }) => {
    try {
      const response = await emailVerification(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const ResendVerificationCodeAsync = createAsyncThunk(
  "user/resendEmailVerificationCode",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ResendVerificationCode(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const resetPasswordRequestAsync = createAsyncThunk(
  "user/resetPasswordRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await resetPasswordRequest(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const resetPasswordAsync = createAsyncThunk(
  "user/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await resetPassword(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const verifyCodeAsync = createAsyncThunk(
  "user/verifyCode",
  async (data, { rejectWithValue }) => {
    try {
      const response = await verifyCode(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const GetLoginUserAsync = createAsyncThunk(
  "auth/GetLoginUser",
  async () => {
    try {
      const response = await GetLoginUser();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  "auth/update",
  async (update) => {
    const response = await updateUser(update);
    return response;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isVerified = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        state.user = null;
      })
      .addCase(Logout.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.userInfo = null;
      })
      .addCase(emailVerificationAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(emailVerificationAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.isVerified = true;
        state.user = action.payload;
      })
      .addCase(ResendVerificationCodeAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(ResendVerificationCodeAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.isVerified = true;
      })

      .addCase(GetLoginUserAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetLoginUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isVerified = true;
        state.userInfo = action.payload;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userInfo = action.payload;
      });
  },
});

export const selectIsVerified = (state) => state.auth.isVerified;
export const selectUserInfo = (state) => state.auth?.userInfo?.data;
export const selectloginUser = (state) => state.auth?.user?.data;

export default authSlice.reducer;
export const { setUser } = authSlice.actions;
