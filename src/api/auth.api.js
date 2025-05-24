// userService.js
import axios from "../utils/axiosUserService";

export const registerUser = (userData) => {
  return axios.post("/register", userData);
};

export const verifyOTP = (email, otpCode) => {
  return axios.post("/verify-otp", {
    email,
    otpCode,
  });
};

export const resendOtp = (email) => {
  return axios.post("/resend-otp", {
    email,
  });
};

export const loginUser = (userData) => {
  return axios.post("/login", userData);
};

export const logoutUser = (refreshToken) => {
  return axios.post("/logout", { refreshToken });
};

export const changePassword = (userData) => {
  return axios.post("/change-password", userData);
};

export const forgotPassword = (userData) => {
  return axios.post(
    "/forgot-password",
    userData,
  );
};

export const resetPassword = (userData) => {
  return axios.post(
    "/reset-password",
    userData,
    
  );
};
export const getUserProfile = (username) => {
  return axios.get(`/profile/${username}`);
};

export const updateUserProfile = (userId, userData) => {
  return axios.put(`/profile/${userId}`, userData);
};

export const getAllUsers = () => {
  return axios.get("/");
};

export const updateRoleUser = (userId, userData) => {
  return axios.put(`/${userId}`, userData);
};

export const getUserById = (userId) => {
  return axios.get(`/${userId}`);
};

export const createNewUser = (userData) => {
  return axios.post(`/create`, userData);
};

export const deleteUser = (userId) => {
  return axios.delete(`/${userId}`);
};
