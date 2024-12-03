import axios from 'axios';
// import { refreshToken } from "./auth.js"
import checkAuth from '../services/authService.js';
import { toast } from "react-toastify";

const api = axios.create({
  withCredentials: true,
  baseURL: `http://localhost:3001/api/`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

api.interceptors.request.use((config) => {
  console.log("interceptors request")
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use((response) => {
  console.log("interceptors response good");
  return response
},
  async (error) => {
    console.log("interceptors response bad", error.response?.status)
    const originalRequest = error.config;
    if (error.response?.status === 403) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        const isAuth = await checkAuth();

        if (isAuth) {
          const newToken = localStorage.getItem('accessToken');
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      }
      else {
        console.log("Status  403, but is retry")
        toast.error("Your session has expired. Please log in again.");
        // window.location.href = '/login';
      }
    }
    // else if (error.response?.status === 404) {
    //   toast.error("Your session has expired. Please log in again.");
    //   window.location.href = '/login';
    // }

    console.log("interceptors response bad")
    return Promise.reject(error);
  }
)

export default api;
