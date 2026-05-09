// src/proxy.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("medistore_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 for non-auth routes
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !error.config?.url?.includes("/auth/")
    ) {
      localStorage.removeItem("medistore_token");
      localStorage.removeItem("medistore_user");
      window.location.href = "/login";
    }
    // Always re-throw so catch blocks in services get the full error
    return Promise.reject(error);
  }
);

export default axiosInstance;