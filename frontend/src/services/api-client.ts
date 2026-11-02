import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor (e.g., for adding auth tokens)
apiClient.interceptors.request.use(
  (config) => {
    // You can add your authentication token here if needed
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (e.g., for handling common errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here (e.g., 401 Unauthorized, 500 Server Error)
    if (error.response?.status === 401) {
      // Logic for handling unauthorized errors
    }
    return Promise.reject(error);
  }
);

export default apiClient;
