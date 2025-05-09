// userService.js
import axios from "../utils/axiosUserService";

export const registerUser = (userData) => {
  return axios.post("/users/register", userData);
};

export const verifyOTP = (email, otpCode) => {
  return axios.post("/users/verify-otp", {
    email,
    otpCode,
  });
};

export const resendOtp = (email) => {
  return axios.post("/users/resend-otp", {
    email,
  });
};

export const loginUser = (userData) => {
  return axios.post("/users/login", userData);
};

export const logoutUser = (refreshToken) => {
  return axios.post("/users/logout", { refreshToken });
};

export const changePassword = (userData) => {
  return axios.post("/users/change-password", userData);
};

export const getUserProfile = (userId) => {
  return axios.get(`/users/profile/${userId}`);
};

export const updateUserProfile = (userId, userData) => {
  return axios.put(`/users/profile/${userId}`, userData);
};

export const getAllUsers = () => {
  return axios.get("/users");
};

export const updateRoleUser = (userId, userData) => {
  return axios.put(`/users/${userId}`, userData);
};

export const createNewUser = (userData) => {
  return axios.post(`/users/create`, userData);
};

export const deleteUser = (userId) => {
  return axios.delete(`/users/${userId}`);
};
