import axios from "axios";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: "http://localhost:8002/api",
  timeout: 10000,
  withCredentials: true,
});
instance.defaults.withCredentials = true;

// Add a request interceptori
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data;
});

export default instance;
