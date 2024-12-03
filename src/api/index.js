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
    console.log("interceptors request config", config)
    const token = localStorage.getItem('accessToken');
    if (token && token !== "undefined") {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// api.interceptors.request.use(async (config) => {
//     console.log('config', config)
//     if (config._isRetry) {
//         return config;
//     }
    
//     console.log("interceptors request")
//     const token = localStorage.getItem('accessToken');
//     console.log("interceptors.request token", token)
//     if (token && token !== "undefined") {
//         console.log("interceptors.request token right, not undefined", token)
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     else {
//         console.log("interceptors.request !token", token)
//         const isAuth = await checkAuth();
//         console.log("isAuth after checkAuth", isAuth)
//         if (isAuth) {
//             token = localStorage.getItem('accessToken');
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         else {
//             toast.error("Your session has expired. Please log in again.");
//             window.location.href = '/login';
//         }
//         console.log("interceptors.request !token", token)
//     }
//     return config;
// });

api.interceptors.response.use((response) => {
    console.log("interceptors response good");

    return response
},
async (error) => {
        console.log("interceptors response bad", error.config)
        const originalRequest = error.config;

        console.log(originalRequest._retry)
        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            const isAuth = await checkAuth();
            console.log("isAuth", isAuth)

            if (isAuth) {
                const newToken = localStorage.getItem('accessToken');
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                // swindow.location.reload()
                console.log("Retrying request with new token", originalRequest);
                return api(originalRequest);
            }
            else {
                toast.error("Your session has expired. Please log in again.");
                window.location.href = '/login';
            }
        }

        console.log(error)
        
        return Promise.reject(error);
    }
)

export default api;
