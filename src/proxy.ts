import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("medistore_token");
    config.headers = config.headers || {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      localStorage.removeItem("medistore_token");
      localStorage.removeItem("medistore_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;