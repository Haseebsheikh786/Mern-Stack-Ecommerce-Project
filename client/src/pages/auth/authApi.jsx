import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function Signup(data) {
  try {
    const response = await axiosInstance.post("/register", data);
    console.log("Response:", response);

    if (response.status === 201 && response.data) {
      return response;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    toast(error.response.data.error);
    console.log("Error:", error.response.data.error);
    throw error;
  }
}

export const Login = async (data) => {
  try {
    const response = await axiosInstance.post("/login", data);
    if (response.status === 200 && response.data) {
      return response;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  const response = await axiosInstance.get("/logout");
  return response;
};

axiosInstance.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalReq = error.config;

    if (
      (error.response.status === 401 || error.response.status === 500) &&
      originalReq &&
      !originalReq._isRetry
    ) {
      originalReq._isRetry = true;

      try {
        const response = await axios.get(`/refresh`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          return axiosInstance.request(originalReq);
        } else {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
export const emailVerification = async (data) => {
  try {
    const response = await axiosInstance.post("/verify-email", data);
    console.log("Response:", response);

    if (response.status === 200 && response.data) {
      return response;
    } else {
      toast(response.data.error);
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    toast(error.response.data.error);
    console.log("Error:", error.response.data.error);
    throw error;
  }
};

export function ResendVerificationCode(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/resend-verification-code", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
        toast("code sent successfully");
      } else {
        const error = await response.text();
        toast(error);
        reject(error);
      }
    } catch (error) {
      toast(error);
      reject(error);
    }
  });
}
export async function resetPasswordRequest(data) {
  try {
    const response = await axios.post("/reset-password-request", data);
    return response.data;
  } catch (error) {
    return error;
  }
}
export async function verifyCode(data) {
  try {
    const response = await axios.post("/verify-code", data);
    return response.data;
  } catch (error) {
    return error;
  }
}

export function resetPassword(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}
export const GetLoginUser = async () => {
  const response = await axiosInstance.get("/own");
  console.log(response);
  return response;
};

export function updateUser(update) {
  const response = axiosInstance.post(`/user/${update._id}`, update);
  return response;
}
